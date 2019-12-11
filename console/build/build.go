package build

import (
	"os/exec"
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
	if image.Type == "build" {
		cmd = exec.Command("docker", "build", "-t", Services_name+"."+image.Name, "-f", image.Source+"/Dockerfile", ".")
	} else if image.Type == "service" {
		cmd = exec.Command("docker", "pull", image.Source)
	}
	return cmd
}

func (image *Definition) RunContainer(Services_name string) *exec.Cmd {
	var cmd *exec.Cmd
	exec.Command("docker", "container", "rm", "-f", Services_name+"_"+image.Name).Run()
	if image.Type == "build" {
		cmd = exec.Command("docker", "run", "-d", "-p", containerPorts(image.Ports), "--name", Services_name+"_"+image.Name, Services_name+"."+image.Name)
	} else if image.Type == "service" {
		cmd = exec.Command("docker", "run", "-d", "-p", containerPorts(image.Ports), "--name", Services_name+"_"+image.Name, image.Source)
	}
	return cmd
}

func containerPorts(ports []string) string {
	var portsToRun string = ""
	for _, port := range ports {
		portsToRun += port
	}
	return portsToRun
}
