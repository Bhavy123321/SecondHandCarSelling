using SecondHandCarSellingAPI.Models;
using FluentValidation;

namespace SecondHandCarSellingAPI.Validators
{
    public class UserUpdateDTOValidator : AbstractValidator<UserUpdateDTO>
    {
        public UserUpdateDTOValidator()
        {
            RuleFor(x => x.UserName)
                .NotEmpty().WithMessage("User name is required")
                .MaximumLength(100).WithMessage("User name cannot exceed 100 characters");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Phone)
                .Matches(@"^[6-9]\d{9}$")
                .When(x => !string.IsNullOrWhiteSpace(x.Phone))
                .WithMessage("Invalid phone number");

            RuleFor(x => x.Role)
                .MaximumLength(50)
                .When(x => !string.IsNullOrWhiteSpace(x.Role));
        }
    }

}
