package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
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

	fmt.Print(data)
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"message": "came through",
		"data": data,
		"error": nil,
	})
}
