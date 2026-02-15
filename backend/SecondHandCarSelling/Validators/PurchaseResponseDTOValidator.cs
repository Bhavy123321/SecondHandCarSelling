namespace SecondHandCarSellingAPI.Validators
{
    using SecondHandCarSellingAPI.Models;
    using FluentValidation;

    namespace YourProject.Validators
    {
        public class PurchaseResponseDTOValidator : AbstractValidator<PurchaseResponseDTO>
        {
            public PurchaseResponseDTOValidator()
            {
                RuleFor(x => x.PurchaseId)
                    .GreaterThan(0).WithMessage("PurchaseId must be a positive integer.");

                RuleFor(x => x.CarId).GreaterThan(0);
                RuleFor(x => x.UserId).GreaterThan(0);

                RuleFor(x => x.PurchasePrice)
                    .GreaterThan(0).WithMessage("Purchase price in response must be greater than 0.");

                RuleFor(x => x.Status)
                    .NotEmpty().WithMessage("Purchase status is missing from the response.");

                RuleFor(x => x.PaymentMethod)
                    .NotEmpty().WithMessage("Payment method must be specified.");

                RuleFor(x => x.CreatedDate)
                    .NotEmpty().WithMessage("Transaction date is required.")
                    .LessThanOrEqualTo(DateTime.Now).WithMessage("CreatedDate cannot be in the future.");
            }
        }
    }
}
