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
    [Route("api/[controller]")]
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
            return _user.GetUser(id);
        }

        [HttpPost("{orgid}")]
        public ActionResult<object> CreateUser([FromBody]User user)
        {
            return _user.CreateUser(user);
        }
    }
}