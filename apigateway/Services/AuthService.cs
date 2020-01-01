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
        private readonly CompanyService _company;
        public AuthService(IOptions<Settings> options, JwtService jwtService, CompanyService company)
        {
            var _db = new MongoClient(options.Value.ConnectionString)
                        .GetDatabase(options.Value.Database);

            _user = _db.GetCollection<User>("users");
            _jwtService = jwtService;
            _company = company;
        }

        public User RegisterUser(Company userCompany)
        {
            //find user first
            var userFound = _user.Find<User>(fuser => fuser.email == userCompany.email).FirstOrDefault();
            if (userFound != null)
            {
                return null;
            };

            userCompany.name = "Admin";
            userCompany.position = "Admin";
            userCompany.role = "ADMIN";
            var company = new Company
            {
                email = userCompany.email,
                companyname = userCompany.companyname,

            };
            var companyCreated = _company.CreateCompany(company);

            if (companyCreated == null)
            {
                return null;
            }

            var user = new User
            {
                email = userCompany.email,
                password = CryptoService.HashPassword(userCompany.password),
                role = userCompany.role,
                organization = companyCreated.id,
                position = userCompany.position
            };
            //insert user and return resp
            _user.InsertOne(user);
            user.password = null;
            return user;
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

