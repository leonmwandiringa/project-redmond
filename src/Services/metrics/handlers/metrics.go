package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"github.com/dopr/metrics/services"
)

func IngestData(c *gin.Context){
	c.Header("Content-Type", "application/json")
	data := make(map[string]interface{})
	if err := c.ShouldBind(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err,
			"status": "unsuccessful",
			"message": "an error occured parsing payload",
			"data": nil,
		})
		return
	}

	//publish message
	nc, err := services.GetNatsConnection()
	if err != nil{
		log.Fatalf("Error: an error occured pushing data", err)
	}
	byteData, _ := json.Marshal(data)
	if err := nc.Publish("metrics", byteData); err != nil {
		log.Fatal(err)
	}

	return
}
