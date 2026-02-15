using System.ComponentModel.DataAnnotations;

namespace SecondHandCarSellingAPI.Models
{
    public class UserModel
    {
        [Key]
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Role { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime? ModifiedDate { get; set; }
    }

    public class UserUpdateDTO
    {
        public string UserName { get; set; } = null!;

        public string Email { get; set; } = null!;
        public string? Phone { get; set; }
        // Role is optional — include only if Admin can change it
        public string? Role { get; set; }
    }

    public class UserONLYCreateDTO
    {
        public string UserName { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string? Phone { get; set; }

        public string Role { get; set; } = "Customer";
    }

    public class UserResponseDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Phone { get; set; }
        public string Role { get; set; } = null!;
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }

    }

}
