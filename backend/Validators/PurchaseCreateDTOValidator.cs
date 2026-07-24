namespace SecondHandCarSellingAPI.Validators
{
    using SecondHandCarSellingAPI.Models;
    using FluentValidation;

    public class PurchaseCreateDTOValidator : AbstractValidator<PurchaseCreateDTO>
    {
        public PurchaseCreateDTOValidator()
        {
            RuleFor(x => x.CarId)
                .GreaterThan(0).WithMessage("A valid Car ID is required.");

            RuleFor(x => x.UserId)
                .GreaterThan(0).WithMessage("A valid User ID is required.");

            RuleFor(x => x.PurchasePrice)
                .GreaterThan(0).WithMessage("Purchase price must be greater than 0.")
                .LessThan(100000000).WithMessage("Price exceeds maximum limit allowed for online processing.");

            // Payment Method should be restricted to specific types
            RuleFor(x => x.PaymentMethod)
                .NotEmpty().WithMessage("Payment method is required.")
                .Must(BeAValidPaymentMethod).WithMessage("Invalid Payment Method. Allowed: Cash, Bank Transfer, Credit Card, Financing.");
        }

        // Custom helper to validate specific allowed values
        private bool BeAValidPaymentMethod(string method)
        {
            var allowedMethods = new List<string> { "Cash", "Bank Transfer", "Credit Card", "Financing" };
            return allowedMethods.Contains(method);
        }
    }
}
