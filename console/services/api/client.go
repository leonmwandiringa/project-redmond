package api

import (
	"bytes"
	"encoding/json"
	"net/http"
)

func SendData() error{
	serverUrl := "http://localhost:5000/metrics"
	payload := make(map[string]interface{})

	payload["data"], _ = GetData()
	requestPayload, _ := json.Marshal(payload)
	_, err := http.Post(serverUrl,"application/json", bytes.NewBuffer(requestPayload))
	if err != nil{
		return nil
	}
	return nil
}
