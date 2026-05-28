using SecondHandCarSellingAPI.Models;
using FluentValidation;

namespace SecondHandCarSellingAPI.Validators
{


    public class CreateReviewDTOValidator : AbstractValidator<CreateReviewDTO>
    {
        public CreateReviewDTOValidator()
        {
            RuleFor(x => x.CarId)
                .GreaterThan(0).WithMessage("A valid Car ID is required.");

            RuleFor(x => x.UserId)
                .GreaterThan(0).WithMessage("A valid User ID is required.");

            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5).WithMessage("Rating must be between 1 and 5 stars.");

            RuleFor(x => x.Comment)
                .MaximumLength(500).WithMessage("Comments cannot exceed 500 characters.")
                .When(x => !string.IsNullOrEmpty(x.Comment));
        }
    }
}
