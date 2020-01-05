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
	nc, ncerr = nats.Connect(nats.DefaultURL)
	if ncerr != nil {
		log.Fatal(ncerr)
	}
	defer nc.Close()
}