using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecondHandCarSellingAPI.Models
{
    public class CarImagesModel
    {
        [Key]
        public int ImageId { get; set; }
        [Required]
        public int CarId { get; set; }
        [Required]
        public string? ImageUrl { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime? ModifiedDate { get; set; }

        [ForeignKey("CarId")]
        public CarModel? Car { get; set; }
    }


    public class CreateCarImageDTO
    {
        public int CarId { get; set; }
        public IFormFile ImageUrl { get; set; }
    }

    public class UpdateCarImageDTO
    {
        public IFormFile? ImageUrl { get; set; }
    }

        public class CarImageResponseDTO
        {
            public int ImageId { get; set; }

            public int CarId { get; set; }

            public string? ImageUrl { get; set; }

            public DateTime CreatedDate { get; set; }
    }
}
