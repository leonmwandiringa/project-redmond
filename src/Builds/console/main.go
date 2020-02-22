package main

import (
	"bytes"
	"fmt"
	"github.com/dopr/console/services/api"
	"github.com/dopr/console/services/auth"
	"github.com/dopr/console/services/build"
	"github.com/dopr/console/services/validation"
	"github.com/fatih/color"
	"github.com/jasonlvhit/gocron"
	"github.com/urfave/cli"
	"io"
	"log"
	"os"
	"os/exec"
	"sync"
	"time"
)

//main config file struct definition
type Dopr struct {
	Services_name string     `json:"services_name"`
	Services      []Artifact `json:"services"`
}

type Artifact struct {
	Artifact_name                 string   `json:"artifact_name"`
	Artifact_type                 string   `json:"artifact_type"`
	Artifact_registry_repository  string   `json:"artifact_registry_repository"`
	Artifact_source               string   `json:"artifact_source"`
	Artifact_ports                []string `json:"artifact_ports"`
	Artifact_environment_variables map[string]interface{} `json:"artifact_environment_variables"`
}

//type EnvironmentVals map[string]interface{}

//////////
func main() {
	app := cli.NewApp()
	app.Name = "Dopr"
	app.Version = "0.1"
	app.Compiled = time.Now()
	app.Authors = []cli.Author{
		cli.Author{
			Name:  "Techadon | Dopr",
			Email: "info@dopr.io",
		},
	}
	app.Copyright = fmt.Sprintf("(c) %d Dopr", time.Now().Year())
	app.Usage = "Containers management, montiroing and Orchestration"
	app.Commands = []cli.Command{
		{
			Name:  "start",
			Usage: "runs deployment",
			Action: func(c *cli.Context) error {

				//get current working directory. havent been tested on all goos. might expect different behaviour on non unix or windows os
				direrr, dir := getWD()
				if direrr != nil {
					color.Set(color.FgRed, color.Bold)
					log.Fatalf("ERROR: an error occured getting current working directory \r\n %s", direrr)
					color.Unset()
					return nil
				}

				//pass file location and parse.
				//todo add yaml parser functionality and checks. if file is not present stop process
				buildValidation := validation.Props{
					Type:     "json",
					Location: fmt.Sprintf("%s/Dopr.json", dir),
				}
				if !buildValidation.ValidateEnv() {
					return nil
				}

				//validate schema of file and get file values
				configContents, err := buildValidation.ValidateFile()
				if err != nil {
					return nil
				}
				//boil down to running the containers
				runContainers(configContents)
				return nil
			},
		},
		{
			Name:  "stop",
			Usage: "stops deployment",
			Action: func(c *cli.Context) error {

				direrr, dir := getWD()
				if direrr != nil {
					color.Set(color.FgRed, color.Bold)
					log.Fatalf("ERROR: an error occured getting current working directory \r\n %s", direrr)
					color.Unset()
				}
				buildValidation := validation.Props{
					Type:     "json",
					Location: fmt.Sprintf("%s/Dopr.json", dir),
				}

				if !buildValidation.ValidateEnv() {
					return nil
				}

				configContents, err := buildValidation.ValidateFile()
				if err != nil {
					return nil
				}

				stopContainers(configContents)
				return nil
			},
		},
		{
			Name:  "login",
			Usage: "authenticates to dopr remote server",
			Flags: []cli.Flag{
				cli.BoolFlag{Name: "username, u"},
				cli.BoolFlag{Name: "password, p"},
			},
			Action: func(c *cli.Context) error {
				if len(c.Args()) < 3 {
					color.Set(color.FgRed, color.Bold)
					log.Fatal("username and password are required to auntenticate to Dopr server")
					color.Unset()
					return nil
				}
				var (
					username string
					password string
				)
				if c.Args().Get(1) == "--username" || c.Args().Get(1) == "-u" {
					username = c.Args().Get(2)
					password = c.Args().Get(0)
					color.Set(color.FgGreen, color.Bold)
					fmt.Printf("Logging %s in\r\n", username)
					color.Unset()
				} else if c.Args().Get(1) == "--password" || c.Args().Get(1) == "-p" {
					username = c.Args().Get(0)
					password = c.Args().Get(2)
					color.Set(color.FgGreen, color.Bold)
					fmt.Printf("Logging %s to the server\r\n", username)
					color.Unset()
				} else {
					color.Set(color.FgRed, color.Bold)
					fmt.Print("invalid parameters were entered \r\n")
					color.Unset()

					log.Fatal("\r\n\r\nNAME:\r\n" +
						"main.exe login - authenticates to dopr remote server\r\n\r\n" +

						"USAGE:\r\n" +
						"   main.exe login [command options] [arguments...]" +

						"\r\n\r\nOPTIONS" +
						"\r\n   --username, -u" +
						"\r\n   --password, -p")

					return nil
				}

				auth.LoginUser(username, password)
				//schedule montior and connect to server
				s := gocron.NewScheduler()
				s.Every(30).Seconds().Do(api.SendData)
				<-s.Start()

				return nil
			},
		},
	}
	app.OnUsageError = func(c *cli.Context, err error, isSubcommand bool) error {
		if isSubcommand {
			return err
		}
		color.Set(color.FgRed, color.Bold)
		fmt.Fprintf(c.App.Writer, "Error: an unknown error occured\r\n")
		color.Unset()
		return nil
	}

	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
	}

}

/*
* run containers in the provided type set
* @returns error if not null
* @params dopr definition object
* @object ref definition object
 */
func runContainers(config validation.Dopr) error {
	// var cmd
	for _, image := range config.Services {
		imageBuild := build.Definition{
			Type:       image.Artifact_type,
			Name:       image.Artifact_name,
			Repository: image.Artifact_registry_repository,
			Source:     image.Artifact_source,
			Ports:      image.Artifact_ports,
			Environment: image.Artifact_environment_variables,
		}
		//build artifacts while outputing stdout
		stdnWriter(imageBuild.BuildContainer(config.Services_name))
	}
	for _, container := range config.Services {
		containerBuild := build.Definition{
			Type:       container.Artifact_type,
			Name:       container.Artifact_name,
			Repository: container.Artifact_registry_repository,
			Source:     container.Artifact_source,
			Ports:      container.Artifact_ports,
			Environment: container.Artifact_environment_variables,
		}
		//run artifact containers while outputting to stdout
		stdnWriter(containerBuild.RunContainer(config.Services_name))
	}
	for _, container := range config.Services {
		containerBuild := build.Definition{
			Type:       container.Artifact_type,
			Name:       container.Artifact_name,
			Repository: container.Artifact_registry_repository,
			Source:     container.Artifact_source,
			Ports:      container.Artifact_ports,
			Environment: container.Artifact_environment_variables,
		}
		//check if container is running foreal
		containerBuild.CheckIfContainerRunning(config.Services_name, "running")
	}
	return nil
}

//get current working directory
func getWD() (error, string) {

	dir, err := os.Getwd()
	if err != nil {
		return err, ""
	}
	return nil, dir
}

func stopContainers(config validation.Dopr) error {
	// var cmd
	for _, image := range config.Services {
		imageBuild := build.Definition{
			Type:       image.Artifact_type,
			Name:       image.Artifact_name,
			Repository: image.Artifact_registry_repository,
			Source:     image.Artifact_source,
			Ports:      image.Artifact_ports,
			Environment: image.Artifact_environment_variables,
		}
		stdnWriter(imageBuild.StopContainer(config.Services_name))
	}

	for _, container := range config.Services {
		containerBuild := build.Definition{
			Type:       container.Artifact_type,
			Name:       container.Artifact_name,
			Repository: container.Artifact_registry_repository,
			Source:     container.Artifact_source,
			Ports:      container.Artifact_ports,
			Environment: container.Artifact_environment_variables,
		}
		containerBuild.CheckIfContainerRunning(config.Services_name, "stopped")
	}
	return nil
}

func stdnWriter(cmd *exec.Cmd) {
	var stdoutBuf, stderrBuf bytes.Buffer
	stdoutIn, _ := cmd.StdoutPipe()
	stderrIn, _ := cmd.StderrPipe()

	var errStdout, errStderr error
	stdout := io.MultiWriter(os.Stdout, &stdoutBuf)
	stderr := io.MultiWriter(os.Stderr, &stderrBuf)
	err := cmd.Start()
	if err != nil {
		color.Set(color.FgRed, color.Bold)
		log.Fatalf("cmd.Start() failed with '%s'\n", err)
		color.Unset()
	}

	var wg sync.WaitGroup
	wg.Add(1)

	go func() {
		_, errStdout = io.Copy(stdout, stdoutIn)
		wg.Done()
	}()

	_, errStderr = io.Copy(stderr, stderrIn)
	wg.Wait()

	err = cmd.Wait()
	if err != nil {
		color.Set(color.FgRed, color.Bold)
		log.Fatalf("cmd.Run() failed with %s\n", err)
		color.Unset()
	}
	if errStdout != nil || errStderr != nil {
		color.Set(color.FgRed, color.Bold)
		log.Fatal("failed to capture stdout or stderr\n")
		color.Unset()
	}
	outStr, errStr := string(stdoutBuf.Bytes()), string(stderrBuf.Bytes())
	fmt.Sprintf("\nout:\n%s\nerr:\n%s\n", outStr, errStr)
}
