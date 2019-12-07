package envcheck

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
)

type Props struct {
	Type     string
	location string
}

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

func (props *Props) ValidateEnv() bool {
	_, dockerErr := exec.LookPath("docker")
	if dockerErr != nil {
		log.Fatal("Error: Docker is not installed on this machine, please install docker first\r\n")
	}
	return dockerErr == nil
}

func (props *Props) ValidateFile() (Kalekin, error) {
	var contents Kalekin
	configFile, err := os.Open("Kalekin.json")
	defer configFile.Close()
	if err != nil {
		log.Fatal("Error: an error occured, couldnt find the config file\r\n")
		return contents, err
	}

	configContents, err := ioutil.ReadAll(configFile)
	if err != nil {
		log.Fatal("Error: an error occured, couldnt read file contents\r\n")
		return contents, err
	}

	jsonErr := json.Unmarshal(configContents, &contents)
	if err != nil {
		log.Fatalf("Error: an error occured converting config contents\r\n %", jsonErr)
		return contents, jsonErr
	}

	return contents, nil
}
