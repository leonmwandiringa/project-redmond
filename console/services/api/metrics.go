package api

import (
	"errors"
	"os/exec"
	"strings"
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
	dataToSend := make(map[string]interface{})
	dataToSend["container_count"] = getContainersRunning()
	dataToSend["image_count"] = numberOfImagesCreated()

	return dataToSend,nil
}

func getContainersRunning() []string{
	var containers []string
	containersRunning, _ := exec.Command("docker", "container", "ps", "-aq").CombinedOutput()
	for _, container := range strings.Split(string(containersRunning), "\n"){
		containers = append(containers, container)
	}
	return containers
}

func numberOfImagesCreated() []string{
	var allImages []string
	images, _ := exec.Command("docker", "image", "ls", "-aq").CombinedOutput()
	for _, image := range strings.Split(string(images), "\n"){
		allImages = append(allImages, image)
	}
	return allImages
}