using System.ComponentModel.DataAnnotations;

namespace SecondHandCarSellingAPI.Models
{
    public class CarStatusModel
    {
        [Key]
        public int StatusId { get; set; }
        [Required]
        public string StatusName { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime? ModifiedDate { get; set; }
    }

    public class CarStatusCreateUpdateDTO
    {
        public string StatusName { get; set; }
    }

    public class CarStatusResponseDTO
    {
        public int StatusId { get; set; }
        public string StatusName { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }

}
