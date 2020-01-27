package services

import (
	"encoding/json"
	"fmt"
	"github.com/streadway/amqp"
	"log"
	"time"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
		panic(fmt.Sprintf("%s: %s", msg, err))
	}
}

var (
	conn *amqp.Connection
	ch *amqp.Channel
)

func InitAmqp() {
	var err error

	conn, err = amqp.Dial("amqp://dopr_rabbit_admin:0dsaoFl6tdsfw0d43d@rabbitmq")
	// conn, err = amqp.Dial("amqp://dopr_rabbit_admin:0dsaoFl6tdsfw0d43d@localhost")

	failOnError(err, "Failed to connect to RabbitMQ")

	ch, err = conn.Channel()
	failOnError(err, "Failed to open a channel")

	err = ch.ExchangeDeclare(
		"dopr-server-metrics", // name
		"direct",                           // type
		true,                               // durable
		false,                              // auto-deleted
		false,                              // internal
		false,                              // noWait
		nil,                                // arguments
	)
	failOnError(err, "Failed to declare the Exchange")

	_, err = ch.QueueDeclare("client-server-metrics", true, false, false, false, nil)
	failOnError(err, "Failed to declare the Exchange")

	err = ch.QueueBind("client-server-metrics", "metrics", "dopr-server-metrics", false, nil)
	return
}

func PublishAmqpMessage(data interface{}, userId string) {
	dataObj := make(map[string]interface{})
	dataObj["user_id"] = userId
	dataObj["data"] = data

	payload, _ := json.Marshal(dataObj)
	err := ch.Publish(
		"dopr-server-metrics", // exchange
		"metrics",                // routing key
		false,                              // mandatory
		false,                              // immediate
		amqp.Publishing{
			DeliveryMode: amqp.Transient,
			ContentType:  "application/json",
			Body:         payload,
			Timestamp:    time.Now(),
		})

	failOnError(err, "Failed to Publish on RabbitMQ")
	return
}