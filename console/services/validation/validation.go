package validation

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"github.com/fatih/color"
)

type Props struct {
	Type     string
	Location string
}

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
	Artifact_enviroment_variables []KeyVal `json:"artifact_enviroment_variables"`
	Artifact_policies             []KeyVal `json:"artifact_enviroment_policies"`
}

type KeyVal struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

func (props *Props) ValidateEnv() bool {
	_, dockerErr := exec.LookPath("docker")
	if dockerErr != nil {
		color.Set(color.FgRed, color.Bold)
		log.Fatal("ERROR: Docker is not installed on this machine, please install docker first\r\n")
		color.Unset()
	}
	return dockerErr == nil
}

func (props *Props) ValidateFile() (Dopr, error) {
	var contents Dopr
	configFile, err := os.Open(props.Location)
	defer configFile.Close()
	if err != nil {
		color.Set(color.FgRed, color.Bold)
		log.Fatal("ERROR: an error occured, couldnt find the config file\r\n")
		color.Unset()
		return contents, err
	}

	configContents, err := ioutil.ReadAll(configFile)
	if err != nil {
		color.Set(color.FgRed, color.Bold)
		log.Fatal("ERROR: an error occured, couldnt read file contents\r\n")
		color.Unset()
		return contents, err
	}

	jsonErr := json.Unmarshal(configContents, &contents)
	if err != nil {
		color.Set(color.FgRed, color.Bold)
		log.Fatalf("ERROR: an error occured converting config contents\r\n %s", jsonErr)
		color.Unset()
		return contents, jsonErr
	}

	return contents, nil
}
