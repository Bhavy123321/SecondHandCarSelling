using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecondHandCarSellingAPI.Data;
using SecondHandCarSellingAPI.Models.DTOs;
using SecondHandCarSellingAPI.Services;

namespace SecondHandCarSellingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly CarSellingDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(CarSellingDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _context.User
                .FirstOrDefaultAsync(u => u.UserName == loginDto.UserName && u.Password == loginDto.Password);

            if (user == null)
            {
                return Unauthorized("Invalid username or password");
            }

            var token = _tokenService.GenerateToken(user.UserName, user.Role, user.UserId.ToString());

            return Ok(new
            {
                Token = token,
                User = new
                {
                    user.UserId,
                    user.UserName,
                    user.Email,
                    user.Role
                }
            });
        }
    }
}
