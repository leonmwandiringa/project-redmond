package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/dopr/metrics/handlers"
)

func init(){
	fmt.Print("running in init")
	//data.Connect()
}
func main(){
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	r.POST("/metrics", handlers.IngestData)
	r.GET("/metrics", func(ctx *gin.Context){
		fmt.Print("came through")
		return
	})

	r.Run(":5001")
}