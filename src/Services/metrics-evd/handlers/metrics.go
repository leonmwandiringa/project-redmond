package handlers

import (
	"github.com/dopr/metrics/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

func IngestData(c *gin.Context){
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
	userId := c.GetHeader("UserId")
	//publish message
	services.PublishAmqpMessage(data, userId)
	return
}
