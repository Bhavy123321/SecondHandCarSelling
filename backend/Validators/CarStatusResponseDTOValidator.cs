namespace SecondHandCarSellingAPI.Validators
{
    using SecondHandCarSellingAPI.Models;
    using FluentValidation;

    namespace YourProject.Validators
    {
        public class CarStatusResponseDTOValidator : AbstractValidator<CarStatusResponseDTO>
        {
            public CarStatusResponseDTOValidator()
            {
                RuleFor(x => x.StatusId)
                    .GreaterThan(0).WithMessage("StatusId must be a valid positive integer.");

                RuleFor(x => x.StatusName)
                    .NotEmpty().WithMessage("StatusName cannot be null or empty in the response.")
                    .MaximumLength(50).WithMessage("StatusName exceeds expected length.");

                RuleFor(x => x.CreatedDate)
                    .NotEmpty().WithMessage("CreatedDate is required.")
                    .LessThanOrEqualTo(DateTime.Now).WithMessage("CreatedDate cannot be in the future.");

                RuleFor(x => x.ModifiedDate)
                    .GreaterThanOrEqualTo(x => x.CreatedDate)
                    .When(x => x.ModifiedDate.HasValue)
                    .WithMessage("ModifiedDate cannot be earlier than CreatedDate.");
            }
        }
    }
}
