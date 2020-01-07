package services

import (
	"log"
	nats "github.com/nats-io/nats.go"
)

var (
	nc *nats.Conn
	ncerr error
)
func GetNatsConnection()(*nats.Conn, error){
	return nc, ncerr
}

func ConnectToServer(){
	nc, ncerr = nats.Connect("localhost:4222", nats.ErrorHandler(func(_ *nats.Conn, _ *nats.Subscription, err error) {
		log.Printf("Error: %v", err)
	}))
	if ncerr != nil {
		log.Fatalf("an error occured con %s", ncerr)
	}
	//defer nc.Close()
}