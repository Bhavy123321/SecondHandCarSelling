using SecondHandCarSellingAPI.Models;
using FluentValidation;


namespace SecondHandCarSellingAPI.Validators
{
    public class UserONLYCreateDTOValidator : AbstractValidator<UserONLYCreateDTO>
    {
        public UserONLYCreateDTOValidator()
        {
            RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("Username is required")
            .MaximumLength(100).WithMessage("User name cannot exceed 100 characters")
            .Matches(@"^[a-zA-Z]+$").WithMessage("Username can only contain letters (A-Z, a-z) and no numbers or special characters");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Phone)
            .NotEmpty()
            .WithMessage("Phone number is required")
            .Matches(@"^[6-9]\d{9}$")
            .WithMessage("Phone number must be a valid 10-digit Indian mobile number");

            RuleFor(x => x.Password)
                .NotEmpty()
                .MinimumLength(6).WithMessage("Password must be at least 6 characters long");

            RuleFor(x => x.Role)
                .Must(role => role == "Buyer" || role == "Admin" || role == "Seller")
                .WithMessage("Invalid Role assigned");
        }
    }
}
namespace SecondHandCarSelling.Validators
{
    public class UserCreateDTOValidator
    {
    }
}
