using SecondHandCarSellingAPI.Data;
using SecondHandCarSellingAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace SecondHandCarSellingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PurchaseController : ControllerBase
    {
        private readonly CarSellingDbContext _context;

        public PurchaseController(CarSellingDbContext context)
        {
            _context = context;
        }

        #region GetAllPurcase

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var purchases = await _context.Purchase
                .Select(p => new PurchaseResponseDTO
                {
                    PurchaseId = p.PurchaseId,
                    CarId = p.CarId,
                    UserId = p.UserId,
                    PurchasePrice = p.PurchasePrice,
                    PaymentMethod = p.PaymentMethod,
                    Status = p.Status,
                    CreatedDate = p.CreatedDate
                })
                .ToListAsync();

            return Ok(purchases);
        }

        #endregion

        #region GetById Purchase

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var purchase = await _context.Purchase
                .Where(p => p.PurchaseId == id)
                .Select(p => new PurchaseResponseDTO
                {
                    PurchaseId = p.PurchaseId,
                    CarId = p.CarId,
                    UserId = p.UserId,
                    PurchasePrice = p.PurchasePrice,
                    PaymentMethod = p.PaymentMethod,
                    Status = p.Status,
                    CreatedDate = p.CreatedDate
                })
                .FirstOrDefaultAsync();

            if (purchase == null)
                return NotFound(new { message = "Purchase not found" });

            return Ok(purchase);
        }

        #endregion

        #region Get Purchases By Buyer

        [HttpGet("buyer/{userId}")]
        public async Task<IActionResult> GetPurchasesByBuyer(int userId)
        {
            var purchases = await _context.Purchase
                .Include(p => p.Car)
                    .ThenInclude(c => c.Brand)
                .Include(p => p.Car.Status)
                .Include(p => p.Car.User)
                .Where(p => p.UserId == userId)
                .Select(p => new
                {
                    p.PurchaseId,
                    p.CarId,
                    p.UserId,
                    p.PurchasePrice,
                    p.PaymentMethod,
                    p.Status,
                    p.CreatedDate,
                    Car = new
                    {
                        p.Car.CarId,
                        p.Car.Title,
                        p.Car.Model,
                        p.Car.Year,
                        BrandName = p.Car.Brand.BrandName,
                        StatusName = p.Car.Status.StatusName,
                        SellerName = p.Car.User.UserName,
                        ImageUrl = _context.CarImages.Where(i => i.CarId == p.Car.CarId).Select(i => i.ImageUrl).FirstOrDefault()
                    }
                })
                .ToListAsync();

            return Ok(purchases);
        }

        #endregion

        #region Get Sales By Seller

        [HttpGet("seller/{userId}/sales")]
        public async Task<IActionResult> GetSalesBySeller(int userId)
        {
            var sales = await _context.Purchase
                .Include(p => p.Car)
                    .ThenInclude(c => c.Brand)
                .Include(p => p.User)
                .Where(p => p.Car.UserId == userId)
                .Select(p => new
                {
                    p.PurchaseId,
                    p.CarId,
                    p.UserId,
                    p.PurchasePrice,
                    p.PaymentMethod,
                    p.Status,
                    p.CreatedDate,
                    Car = new
                    {
                        p.Car.CarId,
                        p.Car.Title,
                        p.Car.Model,
                        p.Car.Year,
                        BrandName = p.Car.Brand.BrandName
                    },
                    BuyerName = p.User.UserName,
                    BuyerEmail = p.User.Email
                })
                .ToListAsync();

            return Ok(sales);
        }

        #endregion

        #region Add New Purchase

        [HttpPost]
        public async Task<IActionResult> Create(PurchaseCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check if car exists and is available
            var car = await _context.Car.Include(c => c.Status).FirstOrDefaultAsync(c => c.CarId == dto.CarId);
            if (car == null)
                return NotFound(new { message = "Car not found" });

            if (car.Status.StatusName != "Available")
                return BadRequest(new { message = "Car is not available for purchase" });

            var purchase = new PurchaseModel
            {
                CarId = dto.CarId,
                UserId = dto.UserId,
                PurchasePrice = dto.PurchasePrice,
                PaymentMethod = dto.PaymentMethod,
                Status = "Completed",
                CreatedDate = DateTime.Now
            };

            _context.Purchase.Add(purchase);

            // Mark car as sold by updating status
            var soldStatus = await _context.CarStatus.FirstOrDefaultAsync(s => s.StatusName == "Sold");
            if (soldStatus != null)
            {
                car.StatusId = soldStatus.StatusId;
                car.ModifiedDate = DateTime.Now;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Purchase completed successfully", purchase.PurchaseId });
        }

        #endregion

        #region Update Purchase

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, PurchaseUpdateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var purchase = await _context.Purchase.FindAsync(id);
            if (purchase == null)
                return NotFound(new { message = "Purchase not found" });

            purchase.Status = dto.Status;
            purchase.PurchasePrice = dto.PurchasePrice;
            purchase.PaymentMethod = dto.PaymentMethod;
            purchase.ModifiedDate = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Purchase updated successfully" });
        }

        #endregion

        #region Delete Purchase

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var purchase = await _context.Purchase.FindAsync(id);
            if (purchase == null)
                return NotFound(new { message = "Purchase not found" });

            _context.Purchase.Remove(purchase);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Purchase deleted successfully" });
        }

        #endregion
    }
}
