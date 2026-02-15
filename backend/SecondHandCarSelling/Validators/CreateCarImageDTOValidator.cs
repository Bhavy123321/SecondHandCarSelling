namespace SecondHandCarSellingAPI.Validators
{
    using FluentValidation;
    using SecondHandCarSellingAPI.Models;

    public class CreateCarImageDTOValidator
        : AbstractValidator<CreateCarImageDTO>
    {
        public CreateCarImageDTOValidator()
        {
            RuleFor(x => x.CarId)
                .GreaterThan(0)
                .WithMessage("CarId must be greater than 0");

            RuleFor(x => x.ImageUrl)
                .NotEmpty()
                .WithMessage("ImageUrl is required");
                
        }

    }

}
