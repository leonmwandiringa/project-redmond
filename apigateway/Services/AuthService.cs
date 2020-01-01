using System;
using api_gateway.Entities.Models;
using MongoDB.Driver;
using api_gateway.Helpers;
using Microsoft.Extensions.Options;
using System.Collections.Generic;

namespace api_gateway.Services
{
    public class AuthService
    {
        private readonly IMongoCollection<User> _user;
        private readonly JwtService _jwtService;
        public AuthService(IOptions<Settings> options, JwtService jwtService)
        {
            var _db = new MongoClient(options.Value.ConnectionString)
                        .GetDatabase(options.Value.Database);

            _user = _db.GetCollection<User>("users");
            _jwtService = jwtService;
        }

        public User RegisterUser(User user)
        {
            //find user first
            var userFound = _user.Find<User>(fuser => fuser.email == user.email).FirstOrDefault();
            if (userFound != null)
            {
                return null;
            };

            var newUser = new User
            {
                email = user.email,
                password = CryptoService.HashPassword(user.password),
                username = user.password,
                organization = "",
            };
            //insert user and return resp
            _user.InsertOne(newUser);
            newUser.password = null;
            return newUser;
        }

        public object LoginUser(string email, string password)
        {
            var userFound = _user.Find(user => user.email == email).FirstOrDefault();
            if (userFound == null)
            {
                return new
                {
                    status = false,
                    message = "an error occured find the user",
                    token = false,
                    data = false
                };
            }

            //verify user password
            var passwordValid = CryptoService.VerifyHashedPassword(userFound.password, password);
            if (!passwordValid)
            {
                return new
                {
                    status = false,
                    message = "it seems like you have entered invalid password",
                    token = false,
                    data = false
                };
            }

            //created successfull respponse
            var token = new
            {
                status = true,
                message = "User successfully authenticated",
                token = _jwtService.Authenticate(userFound.id, userFound.email),
                data = userFound
            };

            return token;

        }
    }
}

