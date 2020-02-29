package data

import (
	"gopkg.in/mgo.v2"
)

func Client() *mgo.Session {
	mongo_test := GetEnvVariable("MONGO_TEST")
	session, err := mgo.Dial(mongo_test)
	if nil != err {
		panic(err)
	}
	session.SetMode(mgo.Monotonic, true)
	return session
}
