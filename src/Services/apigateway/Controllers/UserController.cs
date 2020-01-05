using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_gateway.Entities.Models;
using api_gateway.Services;
using Microsoft.AspNetCore.Cors;

namespace api_gateway.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    [Authorize]
    [EnableCors]
    public class UserController : ControllerBase
    {
        private readonly UserService _user;
        public UserController(UserService user)
        {
            _user = user;
        }

        [HttpGet]
        public ActionResult<List<User>> Get(){
            return _user.GetUsers();
        }

        [HttpGet("{id}")]
        public ActionResult<object> GetUser(string id)
        {

            var userFound = _user.GetUser(id);
            if(userFound == null){
                return StatusCode(403, new
                {
                    status = false,
                    message = "User was not found",
                    data = false
                });
            }

            return StatusCode(200, new
            {
                status = true,
                message = "User was not found",
                data = userFound
            });
            
        }

        [HttpPut("{id}")]
        public ActionResult<object> UpdateUser(string id, [FromBody]User user)
        {
            var userExists = _user.GetUser(id);
            if(userExists == null){
                return StatusCode(403, new
                {
                    status = false,
                    message = "User was not found",
                    data = false
                });
            }
            var UpdateUser = _user.UpdateUser(user, id);
            return StatusCode(200, new
                   {
                     status = true,
                     message = "User was successfully updated",
                     data = UpdateUser
                  });
        }

        [HttpPost("{orgid}")]
        public ActionResult<object> CreateUser([FromBody]User user)
        {
            return _user.CreateUser(user);
        }
    }
}