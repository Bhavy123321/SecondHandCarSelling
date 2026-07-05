using System;
using System.Data;
using SecondHandCarSellingAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace SecondHandCarSellingAPI.Data
{
    public class CarSellingDbContext : DbContext
    {
        public CarSellingDbContext(DbContextOptions<CarSellingDbContext> options)
            : base(options) { }

        public DbSet<UserModel> User { get; set; }
        public DbSet<CarModel> Car { get; set; }
        public DbSet<CarBrandsModel> CarBrand { get; set; }
        public DbSet<CarImagesModel> CarImages { get; set; }
        public DbSet<CarStatusModel> CarStatus { get; set; }
        public DbSet<ReviewModel> Review { get; set; }
        public DbSet<PurchaseModel> Purchase { get; set; }

    }
}