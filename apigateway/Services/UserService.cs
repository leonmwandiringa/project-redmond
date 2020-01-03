using System;
using api_gateway.Entities.Models;
using MongoDB.Driver;
using api_gateway.Helpers;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace api_gateway.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _user;
        public UserService(IOptions<Settings> options, JwtService jwtService)
        {
            var _db = new MongoClient(options.Value.ConnectionString)
                        .GetDatabase(options.Value.Database);

            _user = _db.GetCollection<User>("users");
        }

        public List<User> GetUsers()
        {
            return _user.Find<User>(user => true).ToList();
        }

        public object GetUser(string id)
        {
            return _user.Find<User>(user => user.id == id).FirstOrDefault();    

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

        public User UpdateUser(User user, string id)
        {
            var userFound = _user.Find(u => u.id == user.id).FirstOrDefault();
            if (userFound == null)
            {
                return null;
            }

            var filter = Builders<User>.Filter.Eq("id", id);
            var update = Builders<User>.Update
                         .Set(u=> u.name, user.name)
                         .Set(u=> u.surname, user.surname)
                         .Set(u=> u.organization, user.organization);

            var userUpdated = _user.FindOneAndUpdate<User>(filter, update);

            //created successfull respponse
            return userUpdated;

        }

    }
}

