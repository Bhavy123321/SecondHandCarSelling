namespace SecondHandCarSellingAPI.Validators
{
    using FluentValidation;
    using SecondHandCarSellingAPI.Models;

    public class UpdateCarImageDTOValidator
        : AbstractValidator<UpdateCarImageDTO>
    {
        public UpdateCarImageDTOValidator()
        {
            RuleFor(x => x.ImageUrl)
                .NotEmpty()
                .WithMessage("ImageUrl is required")
                .WithMessage("ImageUrl must be a valid URL");
        }

    }

}
