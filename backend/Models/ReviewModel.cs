using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecondHandCarSellingAPI.Models
{
    public class ReviewModel
    {
        [Key]
        public int ReviewId { get; set; }

        [Required]
        public int CarId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        [StringLength(500)]
        public string? Comment { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public DateTime? ModifiedDate { get; set; }

        // Navigation Properties
        [ForeignKey("CarId")]
        public CarModel? Car { get; set; } = null!;

        [ForeignKey("UserId")]
        public UserModel User { get; set; } = null!;
    }

    public class CreateReviewDTO
    {
        public int CarId { get; set; }
        public int UserId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }

    public class UpdateReviewDTO
    {
        public int Rating { get; set; }
        public string? Comment { get; set; }

    }

    public class ReviewResponseDTO
    {
        public int ReviewId { get; set; }
        public int CarId { get; set; }
        public int UserId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

    }

}
