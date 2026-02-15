using SecondHandCarSellingAPI.Data;
using SecondHandCarSellingAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace SecondHandCarSellingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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

        #region Add New Purchase

        [HttpPost]
        public async Task<IActionResult> Create(PurchaseCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

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
            await _context.SaveChangesAsync();

            return Ok(new { message = "Purchase created successfully", purchase.PurchaseId });
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
