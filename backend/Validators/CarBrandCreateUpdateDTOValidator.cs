namespace SecondHandCarSellingAPI.Validators
{
    using FluentValidation;
    using SecondHandCarSellingAPI.Models;

    public class CarBrandCreateUpdateDTOValidator
        : AbstractValidator<CarBrandCreateUpdateDTO>
    {
        public CarBrandCreateUpdateDTOValidator()
        {
            RuleFor(x => x.BrandName)
                .NotEmpty()
                .WithMessage("Brand name is required")
                .MinimumLength(2)
                .WithMessage("Brand name must be at least 2 characters")
                .MaximumLength(50)
                .WithMessage("Brand name cannot exceed 50 characters");
        }
    }

}
