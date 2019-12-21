package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/leontinashe/doprserver/data"
	"github.com/leontinashe/doprserver/services"
	"net/http"
)

type User struct{
	Username string `json: "username"`
	Email string `json: "email"`
	Password string `json: "password"`
}

func init(){
	fmt.Print("running in init")
	data.Connect()
}
func main(){
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	r.POST("/register", handleRegister)
	r.POST("/login", handleLogin)
	r.Run(":5000")
}

func handleRegister(c *gin.Context){
	c.Header("Content-Type", "application/json")
	var user User
	if err := c.ShouldBind(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err,
			"status": "unsuccessful",
			"message": "an error occured parsing payload",
			"data": nil,
		})
		return
	}

	userRegistered, registerErr := services.RegisterUser(user.Username, user.Password, user.Email)
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"message": "came through",
		"data": userRegistered,
		"error": registerErr,
	})
}

func handleLogin(c *gin.Context){
	var user User
	if err := c.ShouldBind(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err,
			"status": "unsuccessful",
			"message": "an error occured parsing payload",
			"data": nil,
		})
		return
	}
	_, token, err := services.SignUserIn(user.Username, user.Password)
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"message": "User was successfully logged in",
		"data": token,
		"error": err,
	})
}