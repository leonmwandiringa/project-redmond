package auth

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/fatih/color"
	"io/ioutil"
	"log"
	"net/http"
	"github.com/muesli/cache2go"
	"time"
)

type User struct{
	Username string
	Token string
	CreatedAt time.Time
}

type ServerResp struct{
	Message string `json:"message"`
	Data string `json:"data"`
	Status string `json:"status"`
	Error interface{} `json:"error"`
}

func LoginUser(username, password string) error{
	if len(username) < 2 || len(password) < 2{
		color.Set(color.FgRed, color.Bold)
		log.Fatal("ERROR: username and password not filled in or is invalid\r\n")
		color.Unset()
		return nil
	}
	serverUrl := "http://localhost:5000/login"
	payload := map[string]string{
		"username": username,
		"password": password,
	}
	requestPayload, _ := json.Marshal(payload)

	resp, err := http.Post(serverUrl,"application/json", bytes.NewBuffer(requestPayload))
	if err != nil{
		color.Set(color.FgRed, color.Bold)
		fmt.Println(err)
		log.Fatal("ERROR: an error occured logging in\r\n")
		color.Unset()
	}

	var serverResp ServerResp
	serverData, _ := ioutil.ReadAll(resp.Body)
	json.Unmarshal(serverData, &serverResp)

	if serverResp.Error != nil{
		color.Set(color.FgRed, color.Bold)
		log.Fatalf("ERROR: %s\r\n", serverResp.Error)
		color.Unset()
	}

	persistToMem(username, serverResp.Data)
	color.Set(color.FgGreen, color.Bold)
	fmt.Print("\r\nyou have successfully logged in\r\n")
	color.Unset()
	return nil
}

func persistToMem(username, token string){
	cache := cacheStore()
	valState := User{Username: username, Token: token}
	cache.Add("servertoken", 5*time.Hour, &valState)
	return
}

func getMemObject()(*User, error){
	var user *User
	cache := cacheStore()
	res, err := cache.Value("servertoken")
	if err != nil{
		color.Set(color.FgRed, color.Bold)
		fmt.Print("\r\nan error ooccured persisting to memory\r\n")
		color.Unset()
		return user, err
	}
	userPersisted := res.Data().(*User)
	return userPersisted, nil
}

func cacheStore() *cache2go.CacheTable{
	cache := cache2go.Cache("dopr")
	return cache
}