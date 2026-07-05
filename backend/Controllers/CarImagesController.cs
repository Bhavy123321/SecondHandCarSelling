using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecondHandCarSelling.Services;
using SecondHandCarSellingAPI.Data;
using SecondHandCarSellingAPI.Models;

namespace SecondHandCarSellingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarImagesController : ControllerBase
    {
        private readonly CarSellingDbContext _context;
        private readonly IFileService _fileService;

        public CarImagesController(CarSellingDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        #region Get All Car Images

        [HttpGet]
        public async Task<IActionResult> GetAllImages()
        {
            var images = await _context.CarImages
                .Select(img => new CarImageResponseDTO
                {
                    ImageId = img.ImageId,
                    CarId = img.CarId,
                    ImageUrl = img.ImageUrl,
                    CreatedDate = img.CreatedDate
                })
                .ToListAsync();

            return Ok(images);
        }

        #endregion

        #region GetById Images

        [HttpGet("{id}")]
        public async Task<IActionResult> GetImagesByCarId(int carId)
        {
            var images = await _context.CarImages
                .Where(i => i.CarId == carId)
                .Select(i => new CarImageResponseDTO
                {
                    ImageId = i.ImageId,
                    ImageUrl = i.ImageUrl,
                    CreatedDate = i.CreatedDate
                })
                .ToListAsync();

            if (images.Count == 0)
                return NotFound(new { message = "No images found for this car" });

            return Ok(images);
        }

        #endregion

        #region Add New Car Images

        [HttpPost]
        public async Task<IActionResult> AddCarImages([FromForm]CreateCarImageDTO createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var imagePath = await _fileService.UploadFileAsync(
            createDto.ImageUrl,
                "CarImages"
            );

            var images = new CarImagesModel
            {
                CarId = createDto.CarId,
                ImageUrl = imagePath,
                CreatedDate = DateTime.Now
            };

            _context.CarImages.Add(images);
            await _context.SaveChangesAsync();

            return Ok(images);
        }

        #endregion

        #region Add New Car Images with URL

        [HttpPost("url")]
        public async Task<IActionResult> AddCarImageWithUrl([FromBody] CreateCarImageUrlDTO createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var images = new CarImagesModel
            {
                CarId = createDto.CarId,
                ImageUrl = createDto.ImageUrl,
                CreatedDate = DateTime.Now
            };

            _context.CarImages.Add(images);
            await _context.SaveChangesAsync();

            return Ok(images);
        }

        #endregion

        #region Update Car Images

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateImages(int id,[FromForm] UpdateCarImageDTO updateDto)
        {
            var existingImage = await _context.CarImages.FindAsync(id);
            if (existingImage == null)
                return NotFound(new { message = "Image not found" });

            if (updateDto.ImageUrl != null)
            {
                // Delete old file
                _fileService.DeleteFile(existingImage.ImageUrl);

                // Upload new file
                var newPath = await _fileService.UploadFileAsync(
                    updateDto.ImageUrl,
                    "CarImages"
                );

                existingImage.ImageUrl = newPath;
            }
            existingImage.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Image updated successfully" });
        }

        #endregion

        #region Delete Car images

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteImages(int id)
        {
            var images = await _context.CarImages.FindAsync(id);
            if (images == null)
                return NotFound(new { message = "Image not found" });

            _context.CarImages.Remove(images);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Image Deleted Successfully" });
        }

        #endregion
    }
}
