-- =============================================
-- Second Hand Car Selling Database - Reset and Seed Script
-- =============================================
-- This script deletes all data from all tables and seeds with sample data
-- Run this manually in your SQL Server Management Studio or similar tool
-- =============================================

USE CarSelling;
GO

-- =============================================
-- STEP 1: DELETE ALL DATA (respecting foreign key constraints)
-- =============================================

PRINT 'Deleting all data from tables...';

-- Delete child tables first (tables with foreign keys)
DELETE FROM Purchase;
DELETE FROM Review;
DELETE FROM CarImages;
DELETE FROM Car;
DELETE FROM [User];

-- Delete lookup/reference tables
DELETE FROM CarStatus;
DELETE FROM CarBrand;

-- Reset Identity columns so IDs start from 1 again
DBCC CHECKIDENT ('Purchase', RESEED, 0);
DBCC CHECKIDENT ('Review', RESEED, 0);
DBCC CHECKIDENT ('CarImages', RESEED, 0);
DBCC CHECKIDENT ('Car', RESEED, 0);
DBCC CHECKIDENT ('[User]', RESEED, 0);
DBCC CHECKIDENT ('CarStatus', RESEED, 0);
DBCC CHECKIDENT ('CarBrand', RESEED, 0);

PRINT 'All data deleted and identity columns reset successfully.';
GO

-- =============================================
-- STEP 2: SEED REFERENCE DATA
-- =============================================

PRINT 'Seeding reference data...';

-- Seed Car Statuses
INSERT INTO CarStatus (StatusName, CreatedDate, ModifiedDate) VALUES
('Available', GETDATE(), GETDATE()),
('Sold', GETDATE(), GETDATE()),
('Pending', GETDATE(), GETDATE());

PRINT 'Car statuses seeded.';

-- Seed Car Brands
INSERT INTO CarBrand (BrandName, CreatedDate, ModifiedDate) VALUES
('BMW', GETDATE(), GETDATE()),
('Audi', GETDATE(), GETDATE()),
('Mercedes', GETDATE(), GETDATE()),
('Tesla', GETDATE(), GETDATE()),
('Porsche', GETDATE(), GETDATE());

PRINT 'Car brands seeded.';
GO

-- =============================================
-- STEP 3: SEED USERS
-- =============================================

PRINT 'Seeding users...';

-- Admin User (UserId = 1)
INSERT INTO [User] (UserName, Password, Email, Phone, Role, CreatedDate, ModifiedDate) VALUES
('admin', 'admin123', 'admin@autopremium.com', '1234567890', 'Admin', GETDATE(), GETDATE());

-- Buyer Users (UserId = 2, 3)
INSERT INTO [User] (UserName, Password, Email, Phone, Role, CreatedDate, ModifiedDate) VALUES
('john_buyer', 'buyer123', 'john@example.com', '9876543210', 'Buyer', GETDATE(), GETDATE()),
('sarah_buyer', 'buyer123', 'sarah@example.com', '9876543211', 'Buyer', GETDATE(), GETDATE());

-- Seller Users (UserId = 4, 5, 6)
INSERT INTO [User] (UserName, Password, Email, Phone, Role, CreatedDate, ModifiedDate) VALUES
('mike_seller', 'seller123', 'mike@example.com', '9876543212', 'Seller', GETDATE(), GETDATE()),
('emma_seller', 'seller123', 'emma@example.com', '9876543213', 'Seller', GETDATE(), GETDATE()),
('david_seller', 'seller123', 'david@example.com', '9876543214', 'Seller', GETDATE(), GETDATE());

PRINT 'Users seeded.';
GO

-- =============================================
-- STEP 4: SEED CARS
-- =============================================

PRINT 'Seeding cars...';

-- Cars from mike_seller (UserId = 4) - Mix of Available and Sold
INSERT INTO Car (UserId, BrandId, StatusId, Title, Model, Year, Price, Mileage, FuelType, Transmission, Description, CreatedDate, ModifiedDate) VALUES
(4, 1, 1, 'Luxury BMW X5 in Excellent Condition', 'X5', 2021, 45000, 25000, 'Petrol', 'Automatic', 'Premium luxury SUV with full service history. Loaded with features including panoramic sunroof, leather interior, and advanced safety systems.', GETDATE(), GETDATE()),
(4, 2, 1, 'Audi A4 Premium Sedan', 'A4', 2020, 32000, 35000, 'Diesel', 'Automatic', 'Elegant sedan with exceptional fuel efficiency. Well-maintained with all service records available.', GETDATE(), GETDATE()),
(4, 3, 2, 'Mercedes C-Class - SOLD', 'C-Class', 2019, 38000, 40000, 'Petrol', 'Automatic', 'Sophisticated luxury sedan with premium features. This car has been sold.', GETDATE(), GETDATE());

-- Cars from emma_seller (UserId = 5) - All Available
INSERT INTO Car (UserId, BrandId, StatusId, Title, Model, Year, Price, Mileage, FuelType, Transmission, Description, CreatedDate, ModifiedDate) VALUES
(5, 4, 1, 'Tesla Model 3 Electric - Like New', 'Model 3', 2022, 52000, 15000, 'Electric', 'Automatic', 'Cutting-edge electric vehicle with autopilot. Minimal mileage, barely driven. Comes with all original accessories.', GETDATE(), GETDATE()),
(5, 5, 1, 'Porsche 911 Sports Car', '911', 2020, 85000, 20000, 'Petrol', 'Manual', 'Iconic sports car in pristine condition. Perfect for enthusiasts. Never been in an accident.', GETDATE(), GETDATE());

-- Cars from david_seller (UserId = 6) - Mix
INSERT INTO Car (UserId, BrandId, StatusId, Title, Model, Year, Price, Mileage, FuelType, Transmission, Description, CreatedDate, ModifiedDate) VALUES
(6, 1, 1, 'BMW 3 Series - Great Deal', '3 Series', 2019, 28000, 45000, 'Diesel', 'Automatic', 'Reliable and efficient. Perfect daily driver with great fuel economy.', GETDATE(), GETDATE()),
(6, 2, 1, 'Audi Q7 Family SUV', 'Q7', 2021, 55000, 30000, 'Diesel', 'Automatic', 'Spacious 7-seater SUV perfect for families. Premium interior and entertainment system.', GETDATE(), GETDATE()),
(6, 3, 1, 'Mercedes E-Class Executive', 'E-Class', 2020, 48000, 28000, 'Hybrid', 'Automatic', 'Hybrid luxury sedan with excellent fuel efficiency. Executive comfort at its finest.', GETDATE(), GETDATE());

PRINT 'Cars seeded.';
GO

-- =============================================
-- STEP 5: SEED PURCHASES
-- =============================================

PRINT 'Seeding purchases...';

-- john_buyer (UserId = 2) purchased mike_seller's Mercedes C-Class (CarId = 3)
INSERT INTO Purchase (CarId, UserId, PurchasePrice, PaymentMethod, Status, CreatedDate, ModifiedDate) VALUES
(3, 2, 38000, 'Bank Transfer', 'Completed', DATEADD(day, -5, GETDATE()), GETDATE());

-- sarah_buyer (UserId = 3) could make future purchases
-- Leave empty for now so she can test the purchase flow

PRINT 'Purchases seeded.';
GO

-- =============================================
-- STEP 6: SEED CAR IMAGES (Optional - using placeholder)
-- =============================================

PRINT 'Seeding car images...';

-- For now, we'll skip actual image seeding since the app uses placeholders
-- If you want to add images, you would need to:
-- 1. First insert into Images table
-- 2. Then link via CarImages table

PRINT 'Car images skipped (using placeholders in app).';
GO

-- =============================================
-- VERIFICATION QUERY
-- =============================================

PRINT '';
PRINT '=============================================';
PRINT 'SEEDING COMPLETED SUCCESSFULLY!';
PRINT '=============================================';
PRINT '';
PRINT 'Database Summary:';
PRINT '-------------------';

SELECT 'Users' AS TableName, COUNT(*) AS RecordCount FROM [User]
UNION ALL
SELECT 'Car Brands', COUNT(*) FROM CarBrand
UNION ALL
SELECT 'Car Statuses', COUNT(*) FROM CarStatus
UNION ALL
SELECT 'Cars', COUNT(*) FROM Car
UNION ALL
SELECT 'Purchases', COUNT(*) FROM Purchase;

PRINT '';
PRINT 'Test Accounts:';
PRINT '-------------------';
PRINT 'Admin:  Username: admin        | Password: admin123  | Role: Admin';
PRINT 'Buyer1: Username: john_buyer   | Password: buyer123  | Role: Buyer';
PRINT 'Buyer2: Username: sarah_buyer  | Password: buyer123  | Role: Buyer';
PRINT 'Seller1: Username: mike_seller | Password: seller123 | Role: Seller (3 cars, 1 sold)';
PRINT 'Seller2: Username: emma_seller | Password: seller123 | Role: Seller (2 cars)';
PRINT 'Seller3: Username: david_seller| Password: seller123 | Role: Seller (3 cars)';
PRINT '';
PRINT '=============================================';
PRINT 'You can now login and test the application!';
PRINT '=============================================';
GO
