using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;

namespace SecondHandCarSellingAPI.Models
{
    public class CarModel
    {
        [Key]
        public int CarId { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public int BrandId { get; set; }
        [Required]
        public int ImageId { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required, MaxLength(100)]
        public string Title { get; set; }
        [Required]
        public string Model { get; set; }
        public int Year { get; set; }
        [Required]
        public double Price { get; set; }
        public int Mileage { get; set; }
        [Required]
        public string FuelType { get; set; }
        [Required]
        public string Transmission { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime? ModifiedDate { get; set; }

        [ForeignKey("UserId")]
        public UserModel? User { get; set; }

        [ForeignKey("BrandId")]
        public CarBrandsModel? Brand { get; set; }

        [ForeignKey("StatusId")]
        public CarStatusModel? Status { get; set; }
    }

    public class CarCreateUpdateDTO
    {
        public int UserId { get; set; }

        public int BrandId { get; set; }

        public int ImageId { get; set; }

        public int StatusId { get; set; }

        public string Title { get; set; }

        public string Model { get; set; }

        public int Year { get; set; }

        public double Price { get; set; }

        public int Mileage { get; set; }

        public string FuelType { get; set; }

        public string Transmission { get; set; }

        public string? Description { get; set; }
    }

    public class CarResponseDTO
    {
        public int CarId { get; set; }
        public int ImageId { get; set; }
        public string Title { get; set; }
        public string Model { get; set; }
        public int? Year { get; set; }
        public double Price { get; set; }
        public int? Mileage { get; set; }
        public string FuelType { get; set; }
        public string Transmission { get; set; }
        public string? Description { get; set; }
        public string BrandName { get; set; }
        public string StatusName { get; set; }
        public string UserName { get; set; }
        public string? ImageUrl { get; set; }

        public DateTime CreatedDate { get; set; }
    }


}
