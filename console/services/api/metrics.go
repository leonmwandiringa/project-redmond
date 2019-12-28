package api

import (
	"errors"
	"os/exec"
)

func checkEnvReadiness() bool{
	_, dockerErr := exec.LookPath("docker")
	return dockerErr == nil
}

func GetData() (interface{}, error){
	readiness := checkEnvReadiness()
	if !readiness {
		return nil, errors.New("an error ocured. Docker related")
	}
	dataTosend := map[string]string{
		"name": "crtrt",
		"kablam": "dsadsad",
	}
	return dataTosend,nil
}
