package api

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/dopr/console/services/auth"
	"github.com/fatih/color"
	"log"
	"github.com/muesli/cache2go"
	"net/http"
	"reflect"
	"time"
)

func SendData() error{
	serverUrl := "http://localhost:5000/api/v1/data/metrics"
	payload := make(map[string]interface{})

	payload["changes"] = map[string]bool{
		"data": true,
		"stats": true,
	}
	payload["data"], _ = GetData()
	payload["stats"] = GetStats()

	dataObject, containerErr := GetStatMemObject("container_data")
	if containerErr != nil{
		persistStatToMem(payload["data"], "container_data")
	}
	statObject, statErr := GetStatMemObject("stat_data")
	if statErr != nil{
		persistStatToMem(payload["stats"], "stat_data")
	}



	loc, _ := time.LoadLocation("Africa/Johannesburg")
	now := time.Now().In(loc)
	payload["time"] = now

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

func compareChangeInObj(newMetric interface{}, name string)(bool, error){
	existentMetric, memErr := GetStatMemObject(name)
	if memErr != nil{
		return false, errors.New("An error occured getting mem Object \r\n")
	}
	return areEqualJSON(existentMetric, newMetric)
}

func areEqualJSON(s1, s2 interface{}) (bool, error) {
	var o1 interface{}
	var o2 interface{}

	var err error
	metric1, _ := json.Marshal(s1)
	metric2, _ := json.Marshal(s2)
	err = json.Unmarshal(metric1, &o1)
	if err != nil {
		return false, fmt.Errorf("Error mashalling string 1 :: %s", err.Error())
	}
	err = json.Unmarshal(metric2, &o2)
	if err != nil {
		return false, fmt.Errorf("Error mashalling string 2 :: %s", err.Error())
	}

	return reflect.DeepEqual(o1, o2), nil
}

func persistStatToMem(objToPersist interface{}, name string){
	cache := cacheStore()
	valState := objToPersist
	cache.Add(name, 2*time.Hour, &valState)
	return
}

func GetStatMemObject(name string)(interface{}, error){
	var persistObj interface{}
	cache := cacheStore()
	res, err := cache.Value(name)
	if err != nil{
		color.Set(color.FgRed, color.Bold)
		fmt.Print("\r\nan error ooccured persisting to memory\r\n")
		color.Unset()
		return persistObj, err
	}
	dataPersisted := res.Data().(*interface{})
	return dataPersisted, nil
}

func cacheStore() *cache2go.CacheTable{
	cache := cache2go.Cache("dopr")
	return cache
}