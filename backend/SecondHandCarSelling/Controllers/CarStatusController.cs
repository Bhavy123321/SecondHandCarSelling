using SecondHandCarSellingAPI.Data;
using SecondHandCarSellingAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace SecondHandCarSellingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarStatusController : ControllerBase
    {
        private readonly CarSellingDbContext _context;

        public CarStatusController(CarSellingDbContext context)
        {
            _context = context;
        }

        #region GetAll Car Status

        [HttpGet]
        public async Task<IActionResult> GetAllCarStatus()
        {
            var statuses = await _context.CarStatus
                .OrderByDescending(cs => cs.CreatedDate)
                .Select(cs => new CarStatusResponseDTO
                {
                    StatusId = cs.StatusId,
                    StatusName = cs.StatusName,
                    CreatedDate = cs.CreatedDate,
                    ModifiedDate = cs.ModifiedDate
                })
                .ToListAsync();

            return Ok(statuses);
        }


        #endregion

        #region Get Car Status By ID

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCarStatusById(int id)
        {
            var status = await _context.CarStatus
                .Where(cs => cs.StatusId == id)
                .Select(cs => new CarStatusResponseDTO
                {
                    StatusId = cs.StatusId,
                    StatusName = cs.StatusName,
                    CreatedDate = cs.CreatedDate,
                    ModifiedDate = cs.ModifiedDate
                })
                .FirstOrDefaultAsync();

            if (status == null)
                return NotFound(new { message = "Car Status not found" });

            return Ok(status);
        }


        #endregion

        #region Delete Car Status

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCarStatus(int id)
        {
            var carStatus = _context.CarStatus.Find(id);

            if (carStatus == null)
            {
                return BadRequest(new { message = "Car Status Not Found" });
            }
            _context.CarStatus.Remove(carStatus);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Car Status Deleted Successfully" });
        }

        #endregion

        #region Add New Car Status

        [HttpPost]
        public async Task<IActionResult> AddCarStatus(CarStatusCreateUpdateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool exists = await _context.CarStatus
                .AnyAsync(cs => cs.StatusName == dto.StatusName);

            if (exists)
                return BadRequest(new { message = "Car Status already exists" });

            var carStatus = new CarStatusModel
            {
                StatusName = dto.StatusName,
                CreatedDate = DateTime.Now
            };

            _context.CarStatus.Add(carStatus);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Car Status Added Successfully",
                carStatus.StatusId
            });
        }


        #endregion

        #region Update Car Status


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCarStatus(int id, CarStatusCreateUpdateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingCarStatus = await _context.CarStatus.FindAsync(id);
            if (existingCarStatus == null)
                return NotFound(new { message = "Car Status not found" });

            bool exists = await _context.CarStatus
                .AnyAsync(cs => cs.StatusName == dto.StatusName && cs.StatusId != id);

            if (exists)
                return BadRequest(new { message = "Car Status name already exists" });

            existingCarStatus.StatusName = dto.StatusName;
            existingCarStatus.ModifiedDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Car Status Updated Successfully" });
        }


        #endregion

    }
}
