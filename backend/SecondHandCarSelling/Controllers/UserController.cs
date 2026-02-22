using SecondHandCarSellingAPI.Data;
using SecondHandCarSellingAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace SecondHandCarSellingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly CarSellingDbContext _context;

        public UserController(CarSellingDbContext context)
        {
            _context = context;
        }
        
        #region Get All Users

        //[HttpGet]
        //public async Task<IActionResult> GetAllUser()
        //{
        //    var user = await _context.User.ToListAsync();

        //    return Ok(user);
        //}

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.User
                .Select(u => new UserResponseDto
                {
                    UserId = u.UserId,
                    UserName = u.UserName,
                    Email = u.Email,
                    Phone = u.Phone,
                    Role = u.Role,
                    CreatedDate = u.CreatedDate
                })
                .ToListAsync();

            return Ok(users);
        }

        #endregion

        #region GetById User

        //[HttpGet("{id}")]
        //public async Task<IActionResult> GetUserById(int id)
        //{
        //    var user = await _context.User.FindAsync(id);

        //    if (user == null)
        //        return NotFound(new { message = "User not found" });

        //    return Ok(user);
        //}

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.User
                .Where(u => u.UserId == id)
                .Select(u => new UserResponseDto
                {
                    UserId = u.UserId,
                    UserName = u.UserName,
                    Email = u.Email,
                    Phone = u.Phone,
                    Role = u.Role,
                    CreatedDate = u.CreatedDate
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(user);
        }


        #endregion

        #region Add New User

        [HttpPost]
        public async Task<IActionResult> AddUser(UserONLYCreateDTO createDTO)
        {
            bool exists = await _context.User.AnyAsync(u => u.UserName == createDTO.UserName || u.Email == createDTO.Email);
            if (exists)
                return BadRequest(new { message = "User already exists" });

            var user = new UserModel
            {
                UserName = createDTO.UserName,
                Password = createDTO.Password,
                Email = createDTO.Email,
                Phone = createDTO.Phone,
                Role = createDTO.Role,
                CreatedDate = DateTime.Now,
                ModifiedDate = DateTime.Now
            };

            _context.User.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User created successfully" });
        }

        #endregion

        #region Update User

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateDTO dto)
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = await _context.User.FindAsync(id);
            if (existingUser == null)
                return NotFound(new { message = "User not found" });

            existingUser.UserName = dto.UserName;
            existingUser.Email = dto.Email;
            existingUser.Phone = dto.Phone;
            existingUser.Role = dto.Role;
            existingUser.ModifiedDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { message = "User Updated Successfully" });
        }

        #endregion

        #region Delete User

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.User.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            _context.User.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User Deleted Successfully" });
        }

        #endregion
    }


}
