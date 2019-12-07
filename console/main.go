package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"
	"sync"
	"time"

	"github.com/kalekin/envcheck"
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
			Name:  "run",
			Usage: "runs current deployment",
			Action: func(c *cli.Context) error {
				// if !dockerEnvCheck() {
				// 	return nil
				// }
				if !envcheck.ValidateEnv() {
					return nil
				}
				configContents, err := envcheck.ValidateFile()
				if err != nil {
					return nil
				}
				runContainers(configContents)
				return nil
			},
		},
	}
	app.OnUsageError = func(c *cli.Context, err error, isSubcommand bool) error {
		if isSubcommand {
			return err
		}
		fmt.Fprintf(c.App.Writer, "Error: an unknown error occured\r\n")
		return nil
	}

	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
	}
}

func runContainers(config []byte) error {
	var loadContent Kalekin
	err := json.Unmarshal(config, &loadContent)
	if err != nil {
		log.Fatalf("Error: an error occured converting config contents\r\n %", err)
		return err
	}
	fmt.Printf("%s", loadContent.Services[0].Artifact_name)

	for _, container := range loadContent.Services {
		cmd := exec.Command("docker", "run", "-d", "--name", loadContent.Services_name+"_"+container.Artifact_name, container.Artifact_source)
		stdnWriter(cmd)
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
		log.Fatalf("cmd.Start() failed with '%s'\n", err)
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
		log.Fatalf("cmd.Run() failed with %s\n", err)
	}
	if errStdout != nil || errStderr != nil {
		log.Fatal("failed to capture stdout or stderr\n")
	}
	outStr, errStr := string(stdoutBuf.Bytes()), string(stderrBuf.Bytes())
	fmt.Printf("\nout:\n%s\nerr:\n%s\n", outStr, errStr)
}
