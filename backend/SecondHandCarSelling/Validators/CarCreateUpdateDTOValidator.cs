namespace SecondHandCarSellingAPI.Validators
{
    using FluentValidation;
    using SecondHandCarSellingAPI.Models;

    public class CarCreateUpdateDTOValidator
        : AbstractValidator<CarCreateUpdateDTO>
    {
        public CarCreateUpdateDTOValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0)
                .WithMessage("UserId is required");

            RuleFor(x => x.BrandId)
                .GreaterThan(0)
                .WithMessage("BrandId is required");

            RuleFor(x => x.StatusId)
                .GreaterThan(0)
                .WithMessage("StatusId is required");

            RuleFor(x => x.ImageId)
                .NotNull()
                .WithMessage("ImageId is required");

            RuleFor(x => x.ImageId)
                .GreaterThan(0)
                .WithMessage("ImageId file is empty");

            RuleFor(x => x.Title)
                .NotEmpty()
                .MaximumLength(100)
                .WithMessage("Title is required and cannot exceed 100 characters");

            RuleFor(x => x.Model)
                .NotEmpty()
                .WithMessage("Model is required");

            RuleFor(x => x.Year)
                .InclusiveBetween(1990, DateTime.Now.Year + 1)
                .WithMessage($"Year must be between 1990 and {DateTime.Now.Year + 1}");

            RuleFor(x => x.Price)
                .GreaterThan(0)
                .WithMessage("Price must be greater than 0");

            RuleFor(x => x.Mileage)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Mileage cannot be negative");

            RuleFor(x => x.FuelType)
                .NotEmpty()
                .WithMessage("Fuel type is required");

            RuleFor(x => x.Transmission)
                .NotEmpty()
                .WithMessage("Transmission is required");

            RuleFor(x => x.Description)
                .MaximumLength(500)
                .WithMessage("Description cannot exceed 500 characters");
        }
    }

}
