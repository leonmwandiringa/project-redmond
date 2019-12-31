package services

import (
	"errors"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/dopr/metrics/data"
	"gopkg.in/mgo.v2/bson"
	"time"
)

var jwtSecret []byte = []byte("justanotherauth")

type Claims struct {
	Username string `json: "username"`
	jwt.StandardClaims
}

type User struct{
	ID       bson.ObjectId `json:"id" bson:"_id,omitempty"`
	Username string `json: "username"`
	Email string `json: "email"`
	Password string `json: "password"`
	CreatedAt time.Time `json:"created_at"`
}

/*
* @use sign and return token
* @return token(string), error
* @params username(string)
 */
func signToken(username string) (string, error) {
	//set expiry & claims
	expirationTime := time.Now().Add(365 * time.Hour)
	claims := &Claims{
		Username: username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	//sign token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return tokenString, err
	}

	return tokenString, err
}

func SignUserIn(username string, password string) (User, string, error){
	var token string
	foundUser, userErr := getUser(username, password)
	if userErr != nil{
		return foundUser, token, userErr
	}
	signTokenForUser, tokenErr := signToken(username)
	if tokenErr != nil{
		return foundUser, signTokenForUser, tokenErr
	}
	return foundUser, signTokenForUser, nil
}
/*
* @use gets single user
* @return User, error
* @params username(string)
 */
func getUser(username string, password string) (User, error){
	var user User
	c := data.Client().DB("doprtest").C("users")
	err := c.Find(bson.M{"username": username, "password": password}).One(&user)
	if err != nil{
		return user, err
	}
	return user, nil
}

func RegisterUser(username, password, email string) (User, error){
	var userResp User
	_, userErr := userExists(username, password, email)
	if userErr == nil{
		return userResp, errors.New("User already exists")
	}
	c := data.Client().DB("doprtest").C("users")
	insertErr := c.Insert(User{Username:username, Password:password, Email:email})
	if insertErr != nil{
		return userResp, insertErr
	}
	return userResp, nil
}

func userExists(username, password, email string) (User, error){
	var user User
	c := data.Client().DB("doprtest").C("users")
	err := c.Find(bson.M{"username": username, "password": password, "email": email}).One(&user)
	if err != nil{
		return user, err
	}
	return user, nil
}
/*
* @use validate user by toke
* @return bool, error
* @params token(string)
 */
func ValidateToken(token string) (bool, error) {
	claims := &Claims{}
	Validatedtoken, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if err != nil {
		return false, err
	}
	if !Validatedtoken.Valid {
		return false, errors.New(token)
	}

	return true, nil
}
