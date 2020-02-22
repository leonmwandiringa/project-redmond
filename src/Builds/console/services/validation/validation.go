package validation

import (
	"encoding/json"
	"github.com/fatih/color"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
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
	Artifact_environment_variables map[string]interface{} `json:"artifact_environment_variables"`
}

//type EnvironmentVals map[string]interface{}

//check if docker is installed.
//its the only required prerequisite
func (props *Props) ValidateEnv() bool {
	_, dockerErr := exec.LookPath("docker")
	if dockerErr != nil {
		color.Set(color.FgRed, color.Bold)
		log.Fatal("\r\nERROR: Docker is not installed on this machine, please install docker first\r\n")
		color.Unset()
	}
	return dockerErr == nil
}

//validate and get definition file
func (props *Props) ValidateFile() (Dopr, error) {
	var contents Dopr
	//open the file in working directory
	configFile, err := os.Open(props.Location)
	defer configFile.Close()
	if err != nil {
		color.Set(color.FgRed, color.Bold)
		log.Fatal("\r\nERROR: an error occured, couldnt find the config file\r\n")
		color.Unset()
		return contents, err
	}

	//read and commit to memory file for serialization to required format
	configContents, err := ioutil.ReadAll(configFile)
	if err != nil {
		color.Set(color.FgRed, color.Bold)
		log.Fatal("\r\nERROR: an error occured, couldnt read file contents\r\n")
		color.Unset()
		return contents, err
	}

	//convert json to required struct type schema
	jsonErr := json.Unmarshal(configContents, &contents)
	if err != nil {
		color.Set(color.FgRed, color.Bold)
		log.Fatalf("\r\nERROR: an error occured converting config contents\r\n %s", jsonErr)
		color.Unset()
		return contents, jsonErr
	}

	return contents, nil
}
