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

        // Explicitly format tables to prevent PostgreSQL naming crashes
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Map to safe lowercase, pluralized table names in PostgreSQL
            modelBuilder.Entity<UserModel>().ToTable("users");
            modelBuilder.Entity<CarModel>().ToTable("cars");
            modelBuilder.Entity<CarBrandsModel>().ToTable("car_brands");
            modelBuilder.Entity<CarImagesModel>().ToTable("car_images");
            modelBuilder.Entity<CarStatusModel>().ToTable("car_statuses");
            modelBuilder.Entity<ReviewModel>().ToTable("reviews");
            modelBuilder.Entity<PurchaseModel>().ToTable("purchases");
        }
    }
}