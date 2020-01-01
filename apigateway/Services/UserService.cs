﻿using System;
using api_gateway.Entities.Models;
using MongoDB.Driver;
using api_gateway.Helpers;
using Microsoft.Extensions.Options;
using System.Collections.Generic;

namespace api_gateway.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _user;
        private readonly CompanyService _company;
        public UserService(IOptions<Settings> options, JwtService jwtService, CompanyService company)
        {
            var _db = new MongoClient(options.Value.ConnectionString)
                        .GetDatabase(options.Value.Database);

            _user = _db.GetCollection<User>("users");
            _company = company;
        }

        public List<User> GetUsers()
        {
            return _user.Find<User>(user => true).ToList();
        }

        public object GetUser(string id)
        {
            try
            {
                return _user.Find<User>(user => user.id == id).FirstOrDefault();    
            }
            catch (Exception err)
            {
                return new
                {
                    message = "Sorry an error occured, its either user was not found or database error",
                    error = err.Message
                };
            }

        }

        public object CreateUser(User user)
        {
            //search for user with this email first
            var userFound = _user.Find<User>(u => u.email == user.email && u.organization == user.organization).FirstOrDefault();
            if (userFound != null)
            {
                return new
                {
                    status = false,
                    message = "Error, user could not be created because user already exists",
                    error = false
                };
            }

            var userToInsert = user;

            try
            {
                _user.InsertOne(user);
                return new
                {
                    status = false,
                    message = "Success, user has been suceesfully created",
                    error = false
                };
            }
            catch (Exception err)
            {
                return new
                {
                    status = false,
                    message = "Sorry an error occured, its either user was not found or database error",
                    error = err.Message
                };
            }
        }

    }
}
