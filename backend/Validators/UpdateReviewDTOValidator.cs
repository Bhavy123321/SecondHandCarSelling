namespace SecondHandCarSellingAPI.Validators
{
    using SecondHandCarSellingAPI.Models;
    using FluentValidation;

    public class UpdateReviewDTOValidator : AbstractValidator<UpdateReviewDTO>
    {
        public UpdateReviewDTOValidator()
        {
            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5)
                .WithMessage("Rating must be between 1 and 5 stars.");

            RuleFor(x => x.Comment)
                .MaximumLength(1000)
                .WithMessage("Comment cannot exceed 1000 characters.")
                .When(x => x.Comment != null);


            RuleFor(x => x.Comment)
                .Must(c => !string.IsNullOrWhiteSpace(c))
                .WithMessage("Comment cannot be empty or just spaces.")
                .When(x => x.Comment != null);
        }
    }
}
