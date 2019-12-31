package data

import (
	"gopkg.in/mgo.v2"
)

func Client() *mgo.Session{
	session, err := mgo.Dial("mongodb://dopr:dopr101@ds115442.mlab.com:15442/doprtest")
	if nil != err {
		panic(err)
	}
	session.SetMode(mgo.Monotonic, true)
	return session
}
