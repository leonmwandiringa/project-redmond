using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using api_gateway.Entities.Models;
using api_gateway.Services;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using api_gateway.Helpers;

namespace api_gateway.Controllers
{
    [Route("api/[controller]")]
    [EnableCors]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly CompanyService _companyService;

        public AuthController(AuthService authService, CompanyService companyService)
        {
            _authService = authService;
            _companyService = companyService;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public ActionResult<User> Register([FromBody]Usercompany userCompany)
        {

            if (string.IsNullOrEmpty(userCompany.email) || string.IsNullOrEmpty(userCompany.password) || string.IsNullOrEmpty(userCompany.companyname))
            {
                return BadRequest(new
                {
                    status =  false,
                    message = "All fields are required for registration",
                    data = false
                });
            }
            
            var _userRegResponse = _authService.RegisterUser(userCompany);

            if (_userRegResponse == null ) {
                return StatusCode(403, new
                {
                    status = false,
                    message = "User or company with the same email address is already registered. Try using another email account",
                    data = false
                });
                
            }
            return Ok(new
            {
                status = true,
                message = "User was successfully created",
                data = _userRegResponse
            });

        }

        [HttpPost("login")]
        public ActionResult<User> Login([FromBody]User User)
        {
            if (string.IsNullOrEmpty(User.email) || string.IsNullOrEmpty(User.password))
            {
                return StatusCode(403, new
                {
                    status = false,
                    message = "email and password are required for Logging in",
                    data = false
                });
            }
            //get authentication response from service
            var _userCredsCorrect = _authService.LoginUser(User.email, User.password);
            return Ok(_userCredsCorrect);

        }
    }


}

