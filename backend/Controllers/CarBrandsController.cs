using SecondHandCarSellingAPI.Data;
using SecondHandCarSellingAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace SecondHandCarSellingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarBrandsController : ControllerBase
    {
        private readonly CarSellingDbContext _context;

        public CarBrandsController(CarSellingDbContext context)
        {
            _context = context;
        }

        #region GetAll Car Brands
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CarBrandResponseDTO>>> GetAllBrands()
        {
            var brands = await _context.CarBrand
                .OrderByDescending(b => b.CreatedDate)
                .Select(b => new CarBrandResponseDTO
                {
                    BrandId = b.BrandId,
                    BrandName = b.BrandName,
                    CreatedDate = b.CreatedDate
                })
                .ToListAsync();

            return Ok(brands);
        }


        #endregion

        #region Get Car Brand By ID

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBrandById(int id)
        {
            var brand = await _context.CarBrand
                .Where(b => b.BrandId == id)
                .Select(b => new CarBrandResponseDTO
                {
                    BrandId = b.BrandId,
                    BrandName = b.BrandName,
                    CreatedDate = b.CreatedDate
                })
                .FirstOrDefaultAsync();

            if (brand == null)
                return NotFound(new { message = "Brand Not Found" });

            return Ok(brand);
        }


        #endregion

        #region Add Car Brand

        [HttpPost]
        public async Task<IActionResult> AddBrand(CarBrandCreateUpdateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool exists = await _context.CarBrand
                .AnyAsync(b => b.BrandName == dto.BrandName);

            if (exists)
                return BadRequest(new { message = "Brand already exists" });

            var brand = new CarBrandsModel
            {
                BrandName = dto.BrandName,
                CreatedDate = DateTime.Now
            };

            _context.CarBrand.Add(brand);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Brand Added Successfully", brand.BrandId });
        }

        #endregion

        #region Delete Car Brand

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCarBrand(int id)
        {
            var carBrand = await _context.CarBrand.FindAsync(id);
            if (carBrand == null)
                return NotFound(new { message = "Car Brand not found" });

            _context.CarBrand.Remove(carBrand);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Car Brand Deleted Successfully" });
        }

        #endregion

        #region Update Car Brand

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBrand(int id, CarBrandCreateUpdateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var brand = await _context.CarBrand.FindAsync(id);
            if (brand == null)
                return NotFound(new { message = "Brand Not Found" });

            bool exists = await _context.CarBrand
                .AnyAsync(b => b.BrandName == dto.BrandName && b.BrandId != id);

            if (exists)
                return BadRequest(new { message = "Brand name already exists" });

            brand.BrandName = dto.BrandName;
            brand.ModifiedDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Brand Updated Successfully" });
        }


        #endregion
    }
}
