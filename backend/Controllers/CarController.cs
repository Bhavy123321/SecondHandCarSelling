using System.Data;
using SecondHandCarSellingAPI.Data;
using SecondHandCarSellingAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace SecondHandCarSellingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarController : ControllerBase
    {
        private readonly CarSellingDbContext _context;

        public CarController(CarSellingDbContext context)
        {
            _context = context;
        }

        #region Get All Cars

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CarResponseDTO>>> GetAllCars()
        {
            var cars = await _context.Car
                .Include(c => c.Brand)
                .Include(c => c.Status)
                .Include(c => c.User)
                .Select(c => new CarResponseDTO
                {
                    CarId = c.CarId,
                    UserId = c.UserId,
                    Title = c.Title,
                    Model = c.Model,
                    Year = c.Year,
                    Price = c.Price,
                    Mileage = c.Mileage,
                    FuelType = c.FuelType,
                    Transmission = c.Transmission,
                    Description = c.Description,
                    CreatedDate = c.CreatedDate,
                    BrandId = c.BrandId,
                    BrandName = c.Brand.BrandName,
                    StatusId = c.StatusId,
                    StatusName = c.Status.StatusName,
                    UserName = c.User.UserName,
                    ImageUrl = _context.CarImages.Where(i => i.CarId == c.CarId).Select(i => i.ImageUrl).FirstOrDefault(),
                    ContactNumber = c.ContactNumber
                })
                .ToListAsync();

            return Ok(cars);
        }

        #endregion

        #region GetById Cars

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCarById(int id)
        {
            var car = await _context.Car
                .Include(c => c.Brand)
                .Include(c => c.Status)
                .Include(c => c.User)
                .Where(c => c.CarId == id)
                .Select(c => new CarResponseDTO
                {
                    CarId = c.CarId,
                    UserId = c.UserId,
                    Title = c.Title,
                    Model = c.Model,
                    Year = c.Year,
                    Price = c.Price,
                    Mileage = c.Mileage,
                    FuelType = c.FuelType,
                    Transmission = c.Transmission,
                    Description = c.Description,
                    CreatedDate = c.CreatedDate,
                    BrandId = c.BrandId,
                    BrandName = c.Brand.BrandName,
                    StatusId = c.StatusId,
                    StatusName = c.Status.StatusName,
                    UserName = c.User.UserName,
                    ImageUrl = _context.CarImages.Where(i => i.CarId == c.CarId).Select(i => i.ImageUrl).FirstOrDefault(),
                    ContactNumber = c.ContactNumber
                })
                .FirstOrDefaultAsync();

            if (car == null)
                return NotFound(new { message = "Car Not Found" });

            // Visibility Logic for Sold Cars
            if (car.StatusName == "Sold")
            {
                // If user is not authenticated, they can't see sold cars
                if (User.Identity == null || !User.Identity.IsAuthenticated)
                    return NotFound(new { message = "Car Not Found (Sold)" }); // Return 404 to hide existence

                // Get current user ID from claims
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int currentUserId))
                     return NotFound(new { message = "Car Not Found" });

                var userRole = User.Claims.FirstOrDefault(c => c.Type == "Role")?.Value;

                // 1. Admin can see everything
                if (userRole == "Admin") return Ok(car);

                // 2. Seller (Owner) can see their own sold car
                var isOwner = await _context.Car.AnyAsync(c => c.CarId == id && c.UserId == currentUserId);
                if (isOwner) return Ok(car);

                // 3. Buyer can see the car they bought
                var isBuyer = await _context.Purchase.AnyAsync(p => p.CarId == id && p.UserId == currentUserId);
                if (isBuyer) return Ok(car);

                // If none of the above, hide it
                return NotFound(new { message = "Car Not Found (Sold)" });
            }

            return Ok(car);
        }

        #endregion

        #region Get Cars By Seller

        [HttpGet("seller/{userId}")]
        public async Task<ActionResult<IEnumerable<CarResponseDTO>>> GetCarsBySeller(int userId)
        {
            var cars = await _context.Car
                .Include(c => c.Brand)
                .Include(c => c.Status)
                .Include(c => c.User)
                .Where(c => c.UserId == userId)
                .Select(c => new CarResponseDTO
                {
                    CarId = c.CarId,
                    UserId = c.UserId,
                    Title = c.Title,
                    Model = c.Model,
                    Year = c.Year,
                    Price = c.Price,
                    Mileage = c.Mileage,
                    FuelType = c.FuelType,
                    Transmission = c.Transmission,
                    Description = c.Description,
                    CreatedDate = c.CreatedDate,
                    BrandId = c.BrandId,
                    BrandName = c.Brand.BrandName,
                    StatusId = c.StatusId,
                    StatusName = c.Status.StatusName,
                    UserName = c.User.UserName,
                    ImageUrl = _context.CarImages.Where(i => i.CarId == c.CarId).Select(i => i.ImageUrl).FirstOrDefault(),
                    ContactNumber = c.ContactNumber
                })
                .ToListAsync();

            return Ok(cars);
        }

        #endregion

        #region Get Available Cars

        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<CarResponseDTO>>> GetAvailableCars()
        {
            var cars = await _context.Car
                .Include(c => c.Brand)
                .Include(c => c.Status)
                .Include(c => c.User)
                .Where(c => c.Status.StatusName == "Available")
                .Select(c => new CarResponseDTO
                {
                    CarId = c.CarId,
                    UserId = c.UserId,
                    Title = c.Title,
                    Model = c.Model,
                    Year = c.Year,
                    Price = c.Price,
                    Mileage = c.Mileage,
                    FuelType = c.FuelType,
                    Transmission = c.Transmission,
                    Description = c.Description,
                    CreatedDate = c.CreatedDate,
                    BrandId = c.BrandId,
                    BrandName = c.Brand.BrandName,
                    StatusId = c.StatusId,
                    StatusName = c.Status.StatusName,
                    UserName = c.User.UserName,
                    ImageUrl = _context.CarImages.Where(i => i.CarId == c.CarId).Select(i => i.ImageUrl).FirstOrDefault(),
                    ContactNumber = c.ContactNumber
                })
                .ToListAsync();

            return Ok(cars);
        }

        #endregion

        #region Add New Car

        [HttpPost]
        public async Task<IActionResult> AddCar(CarCreateUpdateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var car = new CarModel
            {
                UserId = dto.UserId,
                BrandId = dto.BrandId,
                StatusId = dto.StatusId,
                ImageId = dto.ImageId,
                Title = dto.Title,
                Model = dto.Model,
                Year = dto.Year,
                Price = dto.Price,
                Mileage = dto.Mileage,
                FuelType = dto.FuelType,
                Transmission = dto.Transmission,
                Description = dto.Description,
                ContactNumber = dto.ContactNumber,
                CreatedDate = DateTime.Now
            };

            _context.Car.Add(car);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Car Added Successfully", car.CarId });
        }

        #endregion

        #region Update Car

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCar(int id, CarCreateUpdateDTO dto)
        {
            var existingCar = await _context.Car.FindAsync(id);
            if (existingCar == null)
                return NotFound(new { message = "Car not found" });

            existingCar.UserId = dto.UserId;
            existingCar.BrandId = dto.BrandId;
            existingCar.StatusId = dto.StatusId;
            existingCar.ImageId = dto.ImageId;
            existingCar.Title = dto.Title;
            existingCar.Model = dto.Model;
            existingCar.Year = dto.Year;
            existingCar.Price = dto.Price;
            existingCar.Mileage = dto.Mileage;
            existingCar.FuelType = dto.FuelType;
            existingCar.Transmission = dto.Transmission;
            existingCar.Description = dto.Description;
            existingCar.ContactNumber = dto.ContactNumber;
            existingCar.ModifiedDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Car Updated Successfully" });
        }

        #endregion

        #region Delete Car

        [Authorize] // Admin or car owner can delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            var car = await _context.Car.FindAsync(id);
            if (car == null)
                return NotFound(new { message = "Car not found" });

            _context.Car.Remove(car);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Car Deleted Successfully" });
        }
        #endregion
    }
}