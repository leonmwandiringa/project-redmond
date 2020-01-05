package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/dopr/console/services/auth"
	"github.com/fatih/color"
	"log"
	"net/http"
	"time"
)

func SendData() error{
	serverUrl := "http://localhost:5000/api/v1/data/metrics"
	payload := make(map[string]interface{})

	payload["data"], _ = GetData()
	payload["stats"] = GetStats()

	requestPayload, _ := json.Marshal(payload)
	//_, err := http.Post(serverUrl,"application/json", bytes.NewBuffer(requestPayload))
	token, tknerr := auth.GetMemObject()
	if tknerr != nil{
		color.Set(color.FgRed, color.Bold)
		log.Fatal("\r\nan error ooccured persisting to memory\r\n")
		color.Unset()
	}
	req, err := http.NewRequest("POST", serverUrl, bytes.NewBuffer(requestPayload))
	if err != nil {
		log.Fatal("Error reading request. ", err)
	}
	req.Header.Set("Cache-Control", "no-cache")
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token.Token)
	client := &http.Client{Timeout: time.Second * 2000}
	resp, err := client.Do(req)

	if err != nil {
		color.Set(color.FgRed, color.Bold)
		fmt.Println(err)
		log.Fatal("ERROR: an error occured logging in\r\n")
		color.Unset()
	}

	defer resp.Body.Close()

	return nil
}
