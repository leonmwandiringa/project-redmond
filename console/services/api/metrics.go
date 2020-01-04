package api

import (
	"errors"
	"os"
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
	
	imageMetrics, _ := sortImagesMetrics(getImages())
	containerMetrics, _ := sortContainersMetrics(getContainers())
	dataToSend["container_metrics"] = containerMetrics
	dataToSend["image_metrics"] = imageMetrics

	return dataToSend,nil
}

func getContainers() []string{
	var containers []string
	containersRunning, _ := exec.Command("docker", "container", "ps", "-aq").CombinedOutput()
	for _, container := range strings.Split(string(containersRunning), "\n"){
		containers = append(containers, container)
	}
	return containers
}

func getImages() []string{
	var allImages []string
	images, _ := exec.Command("docker", "image", "ls", "-aq").CombinedOutput()
	for _, image := range strings.Split(string(images), "\n"){
		allImages = append(allImages, image)
	}
	return allImages
}

func sortImagesMetrics(images []string) (interface{}, error){
	imagesMetrics := make(map[string]interface{})
	if images == nil || len(images) < 1{
		return imagesMetrics, errors.New("there are no images currently")
	}
	for _, image := range images{
		imageMetric, _ := exec.Command("docker", "image", "inspect", image).CombinedOutput()
		imagesMetrics[image] = string(imageMetric)
	}

	return imagesMetrics, nil
}

func sortContainersMetrics(containers []string) (interface{}, error){
	containersMetrics := make(map[string]interface{})
	if containers == nil || len(containers) < 1{
		return containersMetrics, errors.New("there are no containers currently")
	}
	for _, container := range containers{
		containerMetric, _ := exec.Command("docker", "container", "inspect", container).CombinedOutput()
		containersMetrics[container] = string(containerMetric)
	}
	return containersMetrics, nil
}

func GetStats() string{
	stats, _ := os.Hostname()
	return stats
}