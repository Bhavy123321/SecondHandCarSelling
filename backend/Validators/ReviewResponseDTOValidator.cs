using SecondHandCarSellingAPI.Models;
using FluentValidation;

namespace SecondHandCarSellingAPI.Validators
{
    public class ReviewResponseDTOValidator : AbstractValidator<ReviewResponseDTO>
    {
        public ReviewResponseDTOValidator()
        {
            RuleFor(x => x.ReviewId).NotEmpty().GreaterThan(0);

            RuleFor(x => x.CarId).GreaterThan(0);
            RuleFor(x => x.UserId).GreaterThan(0);

            RuleFor(x => x.Rating).InclusiveBetween(1, 5);

            RuleFor(x => x.CreatedDate).NotEmpty().WithMessage("CreatedDate must be a valid date.");

            RuleFor(x => x.UpdatedDate)
                .GreaterThanOrEqualTo(x => x.CreatedDate)
                .WithMessage("UpdatedDate cannot be before CreatedDate.");
        }
    }
}
