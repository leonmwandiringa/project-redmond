package main

import (
	"github.com/dopr/metrics/handlers"
	"github.com/dopr/metrics/services"
	"github.com/gin-gonic/gin"
)

func init(){
	services.ConnectToServer()
}
func main(){
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	r.POST("/metrics", handlers.IngestData)

	r.Run(":5001")
}