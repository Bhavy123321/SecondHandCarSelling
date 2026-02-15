namespace SecondHandCarSellingAPI.Validators
{
    using SecondHandCarSellingAPI.Models;
    using FluentValidation;

    public class PurchaseUpdateDTOValidator : AbstractValidator<PurchaseUpdateDTO>
    {
        public PurchaseUpdateDTOValidator()
        {

            RuleFor(x => x.Status)
                .NotEmpty().WithMessage("Status is required.")
                .Must(status => BeAValidStatus(status))
                .WithMessage("Invalid Status. Allowed: Available, Reserved, Pending");

            RuleFor(x => x.PurchasePrice)
                .GreaterThan(0).WithMessage("Purchase price must be greater than 0.");

            RuleFor(x => x.PaymentMethod)
                .NotEmpty().WithMessage("Payment method is required.")
                .Must(method => BeAValidPaymentMethod(method))
                .WithMessage("Invalid Payment Method. Allowed: Cash, CreditCard, BankTransfer.");
        }

        // Helper to restrict Status to specific values
        private bool BeAValidStatus(string status)
        {
            var allowedStatuses = new List<string> { "Available", "Reserved", "Pending" };
            return allowedStatuses.Contains(status);
        }

        // Helper to restrict Payment Methods
        private bool BeAValidPaymentMethod(string method)
        {
            var allowedMethods = new List<string> { "Cash", "CreditCard", "BankTransfer" };
            return allowedMethods.Contains(method);
        }
    }
}
