package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"
	"sync"
	"time"

	"github.com/fatih/color"
	"github.com/leontinashe/kalekin/build"
	"github.com/leontinashe/kalekin/validation"
	"github.com/urfave/cli"
)

type Kalekin struct {
	Services_name string     `json:"services_name"`
	Services      []Artifact `json:"services"`
}

type Artifact struct {
	Artifact_name                 string   `json:"artifact_name"`
	Artifact_type                 string   `json:"artifact_type"`
	Artifact_registry_repository  string   `json:"artifact_registry_repository"`
	Artifact_source               string   `json:"artifact_source"`
	Artifact_ports                []string `json:"artifact_ports"`
	Artifact_enviroment_variables []KeyVal `json:"artifact_enviroment_variables"`
	Artifact_policies             []KeyVal `json:"artifact_enviroment_policies"`
}

type KeyVal struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

func main() {
	app := cli.NewApp()
	app.Name = "Kalekin"
	app.Version = "0.1"
	app.Compiled = time.Now()
	app.Authors = []cli.Author{
		cli.Author{
			Name:  "Leon Mwandiringa",
			Email: "leonmwandiringa@gmail.com",
		},
	}
	app.Copyright = "(c) 2019 Kalekin (project redmond)"
	app.Usage = "Containers management"
	app.Commands = []cli.Command{
		{
			Name:  "start",
			Usage: "runs deployment",
			Action: func(c *cli.Context) error {

				buildValidation := validation.Props{
					Type:     "json",
					Location: "Kalekin.json",
				}
				if !buildValidation.ValidateEnv() {
					return nil
				}

				configContents, err := buildValidation.ValidateFile()
				if err != nil {
					return nil
				}

				runContainers(configContents)
				return nil
			},
		},
		{
			Name:  "stop",
			Usage: "stops deployment",
			Action: func(c *cli.Context) error {

				buildValidation := validation.Props{
					Type:     "json",
					Location: "Kalekin.json",
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

func runContainers(config validation.Kalekin) error {
	// var cmd
	for _, image := range config.Services {
		imageBuild := build.Definition{
			Type:       image.Artifact_type,
			Name:       image.Artifact_name,
			Repository: image.Artifact_registry_repository,
			Source:     image.Artifact_source,
			Ports:      image.Artifact_ports,
			// Enviroment: image.Artifact_enviroment_variables,
			// Policies:   image.Artifact_enviroment_variables,
		}
		stdnWriter(imageBuild.BuildContainer(config.Services_name))
	}
	for _, container := range config.Services {
		containerBuild := build.Definition{
			Type:       container.Artifact_type,
			Name:       container.Artifact_name,
			Repository: container.Artifact_registry_repository,
			Source:     container.Artifact_source,
			Ports:      container.Artifact_ports,
			// Enviroment: image.Artifact_enviroment_variables,
			// Policies:   image.Artifact_enviroment_variables,
		}
		stdnWriter(containerBuild.RunContainer(config.Services_name))
	}
	for _, container := range config.Services {
		containerBuild := build.Definition{
			Type:       container.Artifact_type,
			Name:       container.Artifact_name,
			Repository: container.Artifact_registry_repository,
			Source:     container.Artifact_source,
			Ports:      container.Artifact_ports,
			// Enviroment: image.Artifact_enviroment_variables,
			// Policies:   image.Artifact_enviroment_variables,
		}
		containerBuild.CheckIfContainerRunning(config.Services_name, "running")
	}
	return nil
}

func stopContainers(config validation.Kalekin) error {
	// var cmd
	for _, image := range config.Services {
		imageBuild := build.Definition{
			Type:       image.Artifact_type,
			Name:       image.Artifact_name,
			Repository: image.Artifact_registry_repository,
			Source:     image.Artifact_source,
			Ports:      image.Artifact_ports,
			// Enviroment: image.Artifact_enviroment_variables,
			// Policies:   image.Artifact_enviroment_variables,
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
			// Enviroment: image.Artifact_enviroment_variables,
			// Policies:   image.Artifact_enviroment_variables,
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
