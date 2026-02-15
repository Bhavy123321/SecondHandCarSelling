namespace SecondHandCarSellingAPI.Validators
{
    using SecondHandCarSellingAPI.Models;
    using FluentValidation;

    public class CarStatusCreateUpdateDTOValidator : AbstractValidator<CarStatusCreateUpdateDTO>
    {
        public CarStatusCreateUpdateDTOValidator()
        {
            RuleFor(x => x.StatusName)
                .NotEmpty().WithMessage("Status name is required.")
                .MinimumLength(3).WithMessage("Status name must be at least 3 characters long.")
                .MaximumLength(20).WithMessage("Status name cannot exceed 20 characters.")
                .Must(BeAValidFormat).WithMessage("Status name must contain only letters.");
        }

        // Helper to ensure the status name doesn't contain numbers or special characters
        private bool BeAValidFormat(string name)
        {
            if (string.IsNullOrEmpty(name)) return false;
            return name.All(char.IsLetter);
        }
    }
}
