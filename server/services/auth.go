package services

import (
	jwt "github.com/dgrijalva/jwt-go"
	"time"
)

var jwtSecret []byte = []byte("justanotherauth")

type Claims struct {
	Username string `json: "username"`
	jwt.StandardClaims
}

func SignToken(username string) (string, error) {

	expirationTime := time.Now().Add(365 * time.Hours)
	claims := &Claims{
		Username: username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return tokenString, err
	}

	return tokenString, err
}

func ValidateToken(token string) (bool, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if err != nil {
		return false, error
	}
	if !token.Valid {
		return false, error.New(token)
	}
}
