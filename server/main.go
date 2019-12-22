package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/leontinashe/doprserver/handlers"
)

func init(){
	fmt.Print("running in init")
	//data.Connect()
}
func main(){
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	r.POST("/register", handlers.HandleRegister)
	r.POST("/login", handlers.HandleLogin)
	r.Run(":5000")
}