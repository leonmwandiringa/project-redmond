package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type User struct{
	Username string `json: "username"`
	Email string `json: "email"`
	Password string `json: "password"`
}

func main(){
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	r.POST("/register", handleRegister)
	r.POST("/login", handleRegister)
	r.Run(":5000")
}

func handleRegister(c *gin.Context){
	c.Header("Content-Type", "application/json")
	var user User
	if err := c.ShouldBind(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
			"status": "unsuccessful",
			"message": "an error occured parsing payload",
			"data": nil,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"message": "came through",
		"data": user,
	})
}

func handleLogin(c *gin.Context){
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"message": "came through",
		"data": "squadship",
	})
}