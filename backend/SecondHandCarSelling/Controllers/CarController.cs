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
                    Title = c.Title,
                    Model = c.Model,
                    Year = c.Year,
                    Price = c.Price,
                    Mileage = c.Mileage,
                    FuelType = c.FuelType,
                    Transmission = c.Transmission,
                    Description = c.Description,
                    CreatedDate = c.CreatedDate,
                    BrandName = c.Brand.BrandName,
                    StatusName = c.Status.StatusName,
                    UserName = c.User.UserName,
                    ImageUrl = _context.CarImages.Where(i => i.CarId == c.CarId).Select(i => i.ImageUrl).FirstOrDefault()
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
                    Title = c.Title,
                    Model = c.Model,
                    Year = c.Year,
                    Price = c.Price,
                    Mileage = c.Mileage,
                    FuelType = c.FuelType,
                    Transmission = c.Transmission,
                    Description = c.Description,
                    CreatedDate = c.CreatedDate,
                    BrandName = c.Brand.BrandName,
                    StatusName = c.Status.StatusName,
                    UserName = c.User.UserName,
                    ImageUrl = _context.CarImages.Where(i => i.CarId == c.CarId).Select(i => i.ImageUrl).FirstOrDefault()
                })
                .FirstOrDefaultAsync();

            if (car == null)
                return NotFound(new { message = "Car Not Found" });

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
                    Title = c.Title,
                    Model = c.Model,
                    Year = c.Year,
                    Price = c.Price,
                    Mileage = c.Mileage,
                    FuelType = c.FuelType,
                    Transmission = c.Transmission,
                    Description = c.Description,
                    CreatedDate = c.CreatedDate,
                    BrandName = c.Brand.BrandName,
                    StatusName = c.Status.StatusName,
                    UserName = c.User.UserName,
                    ImageUrl = _context.CarImages.Where(i => i.CarId == c.CarId).Select(i => i.ImageUrl).FirstOrDefault()
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
                    Title = c.Title,
                    Model = c.Model,
                    Year = c.Year,
                    Price = c.Price,
                    Mileage = c.Mileage,
                    FuelType = c.FuelType,
                    Transmission = c.Transmission,
                    Description = c.Description,
                    CreatedDate = c.CreatedDate,
                    BrandName = c.Brand.BrandName,
                    StatusName = c.Status.StatusName,
                    UserName = c.User.UserName,
                    ImageUrl = _context.CarImages.Where(i => i.CarId == c.CarId).Select(i => i.ImageUrl).FirstOrDefault()
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
                Title = dto.Title,
                Model = dto.Model,
                Year = dto.Year,
                Price = dto.Price,
                Mileage = dto.Mileage,
                FuelType = dto.FuelType,
                Transmission = dto.Transmission,
                Description = dto.Description,
                CreatedDate = DateTime.Now
            };

            _context.Car.Add(car);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Car Added Successfully", car.CarId });
        }

        #endregion

        #region Update Car

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCar(int id, CarModel car)
        {
            if (id != car.CarId)
                return BadRequest(new { message = "Car ID mismatch" });

            var existingCar = await _context.Car.FindAsync(id);
            if (existingCar == null)
                return NotFound(new { message = "Car not found" });

            existingCar.UserId = car.UserId;
            existingCar.BrandId = car.BrandId;
            existingCar.StatusId = car.StatusId;
            existingCar.Title = car.Title;
            existingCar.Model = car.Model;
            existingCar.Year = car.Year;
            existingCar.Price = car.Price;
            existingCar.Mileage = car.Mileage;
            existingCar.FuelType = car.FuelType;
            existingCar.Transmission = car.Transmission;
            existingCar.Description = car.Description;
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