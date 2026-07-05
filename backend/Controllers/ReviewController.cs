using SecondHandCarSellingAPI.Data;
using SecondHandCarSellingAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace SecondHandCarSellingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly CarSellingDbContext _context;

        public ReviewController(CarSellingDbContext context)
        {
            _context = context;
        }

        #region Get All Review

        [HttpGet]
        public async Task<IActionResult> GetAllReviews()
        {
            var review = await _context.Review.Select(r => new ReviewResponseDTO
            {
                ReviewId = r.ReviewId,
                CarId = r.CarId,
                UserId = r.UserId,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
            }).ToListAsync();
            return Ok(review);
        }

        #endregion

        #region Get Review By ID

        [HttpGet("{id}")]
        public async Task<IActionResult> GetReviewById(int id)
        {
            var review = await _context.Review
                .Where(r => r.ReviewId == id)
                .Select(r => new ReviewResponseDTO
                {
                    ReviewId = r.ReviewId,
                    CarId = r.CarId,
                    UserId = r.UserId,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedDate = r.CreatedDate,
                    UpdatedDate = r.ModifiedDate ?? r.CreatedDate
                })
                .FirstOrDefaultAsync();

            if (review == null)
                return NotFound(new { message = "Review not found" });

            return Ok(review);
        }

        #endregion

        #region Delete Review

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Review.FindAsync(id);
            if (review == null)
                return NotFound(new { message = "Review not found" });

            _context.Review.Remove(review);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Review deleted successfully" });
        }

        #endregion

        #region Add New Review

        [HttpPost]
        public async Task<IActionResult> CreateReview(CreateReviewDTO createReviewdto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var review = new ReviewModel
            {
                CarId = createReviewdto.CarId,
                UserId = createReviewdto.UserId,
                Rating = createReviewdto.Rating,
                Comment = createReviewdto.Comment,
                CreatedDate = DateTime.Now
            };

            _context.Review.Add(review);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Review added successfully", reviewId = review.ReviewId });
        }

        #endregion

        #region Update Review

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReview(int id, UpdateReviewDTO updateReviewdto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var review = await _context.Review.FindAsync(id);
            if (review == null)
                return NotFound(new { message = "Review not found" });

            review.Rating = updateReviewdto.Rating;
            review.Comment = updateReviewdto.Comment;
            review.ModifiedDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Review updated successfully" });
        }

        #endregion
    }
}
