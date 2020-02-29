package main

import (
	"net/http"

	"github.com/dopr/metrics/data"
	"github.com/dopr/metrics/handlers"
	"github.com/dopr/metrics/services"
	"github.com/gin-gonic/gin"
)

func init() {
	services.InitAmqp()
}
func main() {
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	r.POST("/metrics", handlers.IngestData)
	r.GET("/receive", func(c *gin.Context) {
		services.ReceiveMessages()
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "none",
			"status":  "unsuccessful",
			"message": "an error occured parsing payload",
			"data":    nil,
		})
		return
	})

	r.Run(":" + data.GetEnvVariable("PORT"))
}
