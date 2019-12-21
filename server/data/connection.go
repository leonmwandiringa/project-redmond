package data

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
)

var Client *mongo.Client
var connectErr error
func Connect(){
	clientOptions := options.Client().ApplyURI("mongodb://dopr:dopr101@ds115442.mlab.com:15442/doprtest")
	// Connect to MongoDB
	Client, connectErr = mongo.Connect(context.TODO(), clientOptions)
	if connectErr != nil {
		log.Fatal(connectErr)
	}
}
