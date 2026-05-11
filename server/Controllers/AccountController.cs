using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using server.Models;
using server.Dtos.Account;
using server.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Diagnostics.Tracing;
using System.ComponentModel.DataAnnotations;
using System.Security.Principal;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Security.Principal;
using server.Extensions;
namespace server.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController: ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        public AccountController(ITokenService tokenService, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
        {
            _tokenService = tokenService;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult<NewUserDto>> Login(LoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == loginDto.Username);

                if(user == null) return Unauthorized("Invalid username");
                
                var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

                if(!result.Succeeded) return Unauthorized("Username not found or password is incorrect");
                
                return Ok(new NewUserDto
                {
                    UserName = user.UserName,
                    Email = user.Email,
                    Token = _tokenService.CreateToken(user)
                });
                // return Ok("Login successful");

                
            }catch(Exception e)
            {
                return StatusCode(500,e);
                
            }
        }
        [HttpPost("register")]
        public async Task<ActionResult<NewUserDto>> Register(RegisterDto registerDto)
        {
            try
            {
                if(!ModelState.IsValid)
                    return BadRequest(ModelState);
                
                var appUser = new AppUser
                {
                    UserName = registerDto.Username,
                    Email = registerDto.Email
                };
                var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password);
                if (!createdUser.Succeeded){
                    return BadRequest(createdUser.Errors);
                }
                return Ok(new NewUserDto
                    {
                        UserName = appUser.UserName,
                        Email = appUser.Email,
                        Token = _tokenService.CreateToken(appUser)
                    });
            }
                
            catch(Exception e)
            {
                return StatusCode(500,e);
                
            }
        }

    [Authorize]
[HttpGet]
public async Task<ActionResult<NewUserDto>> GetCurrentUser()
{
    var userId = User.GetUserId();

    var user = await _userManager.Users
        .FirstOrDefaultAsync(x => x.Id == userId);

    if (user == null)
        return NotFound("User not found");

    return Ok(new NewUserDto
    {
        UserName = user.UserName,
        Email = user.Email,
    });
}
    

    }
}