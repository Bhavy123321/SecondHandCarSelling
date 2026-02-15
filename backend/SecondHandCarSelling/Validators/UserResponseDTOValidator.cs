using SecondHandCarSellingAPI.Models;
using FluentValidation;

namespace SecondHandCarSellingAPI.Validators;

public class UserResponseDTOValidator : AbstractValidator<UserResponseDto>
{
    public UserResponseDTOValidator()
    {
        RuleFor(x => x.UserId)
            .GreaterThan(0).WithMessage("UserId must be greater than 0.");

        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage("Username is required.")
            .MinimumLength(3).WithMessage("Username must be at least 3 characters.")
            .MaximumLength(50).WithMessage("Username cannot exceed 50 characters.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("A valid email address is required.");

        RuleFor(x => x.Phone)
            .Matches(@"^\+?[1-9]\d{1,14}$")
            .WithMessage("Phone number is not valid.")
            .When(x => !string.IsNullOrEmpty(x.Phone));

        RuleFor(x => x.Role)
            .NotEmpty().WithMessage("Role is required.");

        RuleFor(x => x.CreatedDate)
            .NotEmpty().WithMessage("Created date is required.")
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Created date cannot be in the future.");

        RuleFor(x => x.ModifiedDate)
            .NotEmpty().WithMessage("Created date is required.")
            .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Created date cannot be in the future.");
    }
}
