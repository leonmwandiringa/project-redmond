package services

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/dopr/metrics/data"
	"github.com/nats-io/nats.go"
)

func ConnectToServer() *nats.Conn {
	natsConnectionString := data.GetEnvVariable("INFLUX_HOST") + ":" + data.GetEnvVariable("INFLUX_PORT")
	nc, ncerr := nats.Connect(natsConnectionString, nats.ErrorHandler(func(_ *nats.Conn, _ *nats.Subscription, err error) {
		log.Printf("Error: %v", err)
	}))
	if ncerr != nil {
		log.Printf("an error occured con %s", ncerr)
	}
	return nc
}

func ReceiveMessages() {
	// Subscribe
	conn := ConnectToServer()
	conn.Subscribe("foo", func(m *nats.Msg) {
		fmt.Printf("Received a message: %s\n", string(m.Data))
	})
	defer conn.Close()
}

func PublishMessage(data interface{}) {
	//defer nc.Close()
	conn := ConnectToServer()
	byteData, _ := json.Marshal(data)
	if err := conn.Publish("metrics", byteData); err != nil {
		log.Fatalf("an error occured %s", err)
	}
	defer conn.Close()
}
