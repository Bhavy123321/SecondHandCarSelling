using System.ComponentModel.DataAnnotations;

namespace SecondHandCarSellingAPI.Models
{
    public class CarBrandsModel
    {
        [Key]
        public int BrandId { get; set; }
        [Required]
        public string BrandName { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public DateTime? ModifiedDate { get; set; }

    }

    public class CarBrandCreateUpdateDTO
    {
        public string BrandName { get; set; }
    }

    public class CarBrandResponseDTO
    {
        public int BrandId { get; set; }
        public string BrandName { get; set; }
        public DateTime CreatedDate { get; set; }
    }


}
