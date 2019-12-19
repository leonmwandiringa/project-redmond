package data

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"log"
)

func Client() *mongo.Client{
	clientOptions := options.Client().ApplyURI("mongodb://dopr101:dopr101@ds115442.mlab.com:15442")

	// Connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)
	erre := client.Ping(context.TODO(), readpref.Primary())
	fmt.Print(erre)
	if err != nil {
		log.Fatal(err)
	}
	return client
}