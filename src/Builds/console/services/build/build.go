package build

import (
	"fmt"
	"os/exec"

	"github.com/fatih/color"
)

type Definition struct {
	Type       string
	Name       string
	Repository string
	Source     string
	Ports      []string
	// Enviroment []KeyVal
	// Policies   []KeyVal
}

type KeyVal struct {
	Key   string
	Value string
}

func (image *Definition) BuildContainer(Services_name string) *exec.Cmd {
	var cmd *exec.Cmd
	color.Set(color.FgMagenta, color.Bold)
	fmt.Printf("\n Building %s\r\n", Services_name+"."+image.Name)
	color.Unset()

	if image.Type == "build" {
		cmd = exec.Command("docker", "build", "-t", Services_name+"."+image.Name, "-f", image.Source+"/Dockerfile", ".")
	} else if image.Type == "service" {
		cmd = exec.Command("docker", "pull", image.Source)
	}
	return cmd
}

func (image *Definition) RunContainer(Services_name string) *exec.Cmd {

	color.Set(color.FgMagenta, color.Bold)
	fmt.Printf("\n Stopping running %s container \r\n", Services_name+"_"+image.Name)
	color.Unset()

	exec.Command("docker", "container", "rm", "-f", Services_name+"_"+image.Name).Run()

	color.Set(color.FgMagenta, color.Bold)
	fmt.Printf("\n starting %s container \r\n", Services_name+"_"+image.Name)
	color.Unset()

	var cmd *exec.Cmd
	portsToRun := containerCommand(image.Ports)
	if image.Type == "build" {
		commandTr := append(portsToRun, "--name", Services_name+"_"+image.Name, Services_name+"."+image.Name)
		cmd = exec.Command("docker", commandTr...)
	} else if image.Type == "service" {
		commandTr := append(portsToRun, "--name", Services_name+"_"+image.Name, image.Source)
		cmd = exec.Command("docker", commandTr...)
	}
	return cmd

}

func (image *Definition) CheckIfContainerRunning(Services_name string, isStarted string) {
	containerRunning, _ := exec.Command("docker", "inspect", "-f", "'{{.State.Running}}'", Services_name+"_"+image.Name).CombinedOutput()
	if string(containerRunning)[1:5] == "true" {
		if isStarted == "running" {
			color.Set(color.FgGreen, color.Bold)
			fmt.Printf("\n %s is Running\r\n", Services_name+"_"+image.Name)
			color.Unset()
		} else if isStarted == "stopped" {
			color.Set(color.FgRed, color.Bold)
			fmt.Printf("\n %s failed to stop\r\n", Services_name+"_"+image.Name)
			color.Unset()
		}
	} else {
		if isStarted == "running" {
			color.Set(color.FgRed, color.Bold)
			fmt.Printf("\n %s failed to start\r\n", Services_name+"_"+image.Name)
			color.Unset()
		} else if isStarted == "stopped" {
			color.Set(color.FgGreen, color.Bold)
			fmt.Printf("\n %s was stopped successfully\r\n", Services_name+"_"+image.Name)
			color.Unset()
		}
	}

}

func (image *Definition) StopContainer(Services_name string) *exec.Cmd {
	var cmd *exec.Cmd
	color.Set(color.FgMagenta, color.Bold)
	fmt.Printf("\n Stopping running %s container \r\n", Services_name+"_"+image.Name)
	color.Unset()

	cmd = exec.Command("docker", "container", "stop", Services_name+"_"+image.Name)
	return cmd
}

func containerCommand(ports []string) []string {
	containerToRun := []string{"run", "-d"}
	if len(ports) < 1 {
		return containerToRun
	}
	for _, port := range ports {
		containerToRun = append(containerToRun, "-p", port)
	}
	return containerToRun
}
