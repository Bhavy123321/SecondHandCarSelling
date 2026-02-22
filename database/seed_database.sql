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

-- Seed Car Brands (Extended to 20 brands)
INSERT INTO CarBrand (BrandName, CreatedDate, ModifiedDate) VALUES
('BMW', GETDATE(), GETDATE()),
('Audi', GETDATE(), GETDATE()),
('Mercedes', GETDATE(), GETDATE()),
('Tesla', GETDATE(), GETDATE()),
('Porsche', GETDATE(), GETDATE()),
('Toyota', GETDATE(), GETDATE()),
('Honda', GETDATE(), GETDATE()),
('Ford', GETDATE(), GETDATE()),
('Chevrolet', GETDATE(), GETDATE()),
('Volkswagen', GETDATE(), GETDATE()),
('Nissan', GETDATE(), GETDATE()),
('Hyundai', GETDATE(), GETDATE()),
('Kia', GETDATE(), GETDATE()),
('Lexus', GETDATE(), GETDATE()),
('Jaguar', GETDATE(), GETDATE()),
('Land Rover', GETDATE(), GETDATE()),
('Volvo', GETDATE(), GETDATE()),
('Mazda', GETDATE(), GETDATE()),
('Subaru', GETDATE(), GETDATE()),
('Jeep', GETDATE(), GETDATE());

PRINT 'Car brands seeded (20 brands).';
GO

-- =============================================
-- STEP 3: SEED USERS
-- =============================================

PRINT 'Seeding users with Indian names...';

-- Admin User (UserId = 1)
INSERT INTO [User] (UserName, Password, Email, Phone, Role, CreatedDate, ModifiedDate) VALUES
('admin', 'admin123', 'admin@autopremium.com', '1234567890', 'Admin', GETDATE(), GETDATE());

-- Buyer Users (UserId = 2, 3)
INSERT INTO [User] (UserName, Password, Email, Phone, Role, CreatedDate, ModifiedDate) VALUES
('bhavya', 'bhavya123', 'bhavya@example.com', '9876543210', 'Buyer', GETDATE(), GETDATE()),
('utsav', 'utsav123', 'utsav@example.com', '9876543211', 'Buyer', GETDATE(), GETDATE());

-- Seller Users (UserId = 4, 5, 6)
INSERT INTO [User] (UserName, Password, Email, Phone, Role, CreatedDate, ModifiedDate) VALUES
('vishvas', 'vishvas123', 'vishvas@example.com', '9876543212', 'Seller', GETDATE(), GETDATE()),
('krish', 'krish123', 'krish@example.com', '9876543213', 'Seller', GETDATE(), GETDATE()),
('arjun', 'arjun123', 'arjun@example.com', '9876543214', 'Seller', GETDATE(), GETDATE());

PRINT 'Users seeded.';
GO

-- =============================================
-- STEP 4: SEED CARS (with ContactNumber)
-- =============================================

PRINT 'Seeding cars...';

-- Cars from vishvas (UserId = 4) - Mix of Available and Sold
INSERT INTO Car (UserId, BrandId, StatusId, Title, Model, Year, Price, Mileage, FuelType, Transmission, Description, ContactNumber, CreatedDate, ModifiedDate) VALUES
(4, 1, 1, 'Luxury BMW X5 in Excellent Condition', 'X5', 2021, 45000, 25000, 'Petrol', 'Automatic', 'Premium luxury SUV with full service history. Loaded with features including panoramic sunroof, leather interior, and advanced safety systems.', '+91 98765 43210', GETDATE(), GETDATE()),
(4, 2, 1, 'Audi A4 Premium Sedan', 'A4', 2020, 32000, 35000, 'Diesel', 'Automatic', 'Elegant sedan with exceptional fuel efficiency. Well-maintained with all service records available.', '+91 98765 43210', GETDATE(), GETDATE()),
(4, 3, 2, 'Mercedes C-Class - SOLD', 'C-Class', 2019, 38000, 40000, 'Petrol', 'Automatic', 'Sophisticated luxury sedan with premium features. This car has been sold.', '+91 98765 43210', GETDATE(), GETDATE());

-- Cars from krish (UserId = 5) - All Available
INSERT INTO Car (UserId, BrandId, StatusId, Title, Model, Year, Price, Mileage, FuelType, Transmission, Description, ContactNumber, CreatedDate, ModifiedDate) VALUES
(5, 4, 1, 'Tesla Model 3 Electric - Like New', 'Model 3', 2022, 52000, 15000, 'Electric', 'Automatic', 'Cutting-edge electric vehicle with autopilot. Minimal mileage, barely driven. Comes with all original accessories.', '+91 98765 43211', GETDATE(), GETDATE()),
(5, 5, 1, 'Porsche 911 Sports Car', '911', 2020, 85000, 20000, 'Petrol', 'Manual', 'Iconic sports car in pristine condition. Perfect for enthusiasts. Never been in an accident.', '+91 98765 43211', GETDATE(), GETDATE());

-- Cars from arjun (UserId = 6) - Mix
INSERT INTO Car (UserId, BrandId, StatusId, Title, Model, Year, Price, Mileage, FuelType, Transmission, Description, ContactNumber, CreatedDate, ModifiedDate) VALUES
(6, 1, 1, 'BMW 3 Series - Great Deal', '3 Series', 2019, 28000, 45000, 'Diesel', 'Automatic', 'Reliable and efficient. Perfect daily driver with great fuel economy.', '+91 98765 43212', GETDATE(), GETDATE()),
(6, 2, 1, 'Audi Q7 Family SUV', 'Q7', 2021, 55000, 30000, 'Diesel', 'Automatic', 'Spacious 7-seater SUV perfect for families. Premium interior and entertainment system.', '+91 98765 43212', GETDATE(), GETDATE()),
(6, 3, 1, 'Mercedes E-Class Executive', 'E-Class', 2020, 48000, 28000, 'Hybrid', 'Automatic', 'Hybrid luxury sedan with excellent fuel efficiency. Executive comfort at its finest.', '+91 98765 43212', GETDATE(), GETDATE());

-- Additional cars with different brands
INSERT INTO Car (UserId, BrandId, StatusId, Title, Model, Year, Price, Mileage, FuelType, Transmission, Description, ContactNumber, CreatedDate, ModifiedDate) VALUES
(4, 6, 1, 'Toyota Camry Reliable Sedan', 'Camry', 2020, 24000, 35000, 'Petrol', 'Automatic', 'Extremely reliable family sedan. Low maintenance costs and excellent fuel economy.', '+91 98765 43210', GETDATE(), GETDATE()),
(5, 7, 1, 'Honda Civic Sport', 'Civic', 2021, 26000, 20000, 'Petrol', 'Automatic', 'Sporty compact car with modern tech features. Great for city driving.', '+91 98765 43211', GETDATE(), GETDATE()),
(6, 8, 1, 'Ford Mustang GT', 'Mustang', 2019, 42000, 30000, 'Petrol', 'Manual', 'American muscle car with powerful V8 engine. Thrilling driving experience.', '+91 98765 43212', GETDATE(), GETDATE()),
(4, 10, 1, 'Volkswagen Golf GTI', 'Golf', 2020, 28000, 25000, 'Petrol', 'Automatic', 'Hot hatch with sporty handling and practical interior. Fun daily driver.', '+91 98765 43210', GETDATE(), GETDATE()),
(5, 14, 1, 'Lexus RX Luxury SUV', 'RX', 2021, 48000, 22000, 'Hybrid', 'Automatic', 'Premium hybrid SUV with exceptional comfort and reliability.', '+91 98765 43211', GETDATE(), GETDATE());

PRINT 'Cars seeded (12 cars total).';
GO

-- =============================================
-- STEP 5: SEED PURCHASES
-- =============================================

PRINT 'Seeding purchases...';

-- bhavya (UserId = 2) purchased vishvas's Mercedes C-Class (CarId = 3)
INSERT INTO Purchase (CarId, UserId, PurchasePrice, PaymentMethod, Status, CreatedDate, ModifiedDate) VALUES
(3, 2, 38000, 'Bank Transfer', 'Completed', DATEADD(day, -5, GETDATE()), GETDATE());

-- utsav (UserId = 3) could make future purchases
-- Leave empty for now so he can test the purchase flow

PRINT 'Purchases seeded.';
GO

-- =============================================
-- STEP 6: SEED CAR IMAGES (using picsum.photos)
-- =============================================

PRINT 'Seeding car images with picsum.photos URLs...';

-- Insert images for each car using different picsum.photos IDs
INSERT INTO CarImages (CarId, ImageUrl, CreatedDate, ModifiedDate) VALUES
-- Car 1: BMW X5
(1, 'https://picsum.photos/id/237/800/600', GETDATE(), GETDATE()),
(1, 'https://picsum.photos/id/238/800/600', GETDATE(), GETDATE()),
-- Car 2: Audi A4
(2, 'https://picsum.photos/id/239/800/600', GETDATE(), GETDATE()),
-- Car 3: Mercedes C-Class (Sold)
(3, 'https://picsum.photos/id/240/800/600', GETDATE(), GETDATE()),
-- Car 4: Tesla Model 3
(4, 'https://picsum.photos/id/241/800/600', GETDATE(), GETDATE()),
(4, 'https://picsum.photos/id/242/800/600', GETDATE(), GETDATE()),
-- Car 5: Porsche 911
(5, 'https://picsum.photos/id/243/800/600', GETDATE(), GETDATE()),
-- Car 6: BMW 3 Series
(6, 'https://picsum.photos/id/244/800/600', GETDATE(), GETDATE()),
-- Car 7: Audi Q7
(7, 'https://picsum.photos/id/247/800/600', GETDATE(), GETDATE()),
-- Car 8: Mercedes E-Class
(8, 'https://picsum.photos/id/248/800/600', GETDATE(), GETDATE()),
-- Car 9: Toyota Camry
(9, 'https://picsum.photos/id/249/800/600', GETDATE(), GETDATE()),
-- Car 10: Honda Civic
(10, 'https://picsum.photos/id/250/800/600', GETDATE(), GETDATE()),
-- Car 11: Ford Mustang
(11, 'https://picsum.photos/id/251/800/600', GETDATE(), GETDATE()),
-- Car 12: VW Golf
(12, 'https://picsum.photos/id/252/800/600', GETDATE(), GETDATE()),
-- Car 13: Lexus RX
(13, 'https://picsum.photos/id/253/800/600', GETDATE(), GETDATE());

PRINT 'Car images seeded with picsum.photos URLs.';
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
SELECT 'Purchases', COUNT(*) FROM Purchase
UNION ALL
SELECT 'Car Images', COUNT(*) FROM CarImages;

PRINT '';
PRINT 'Test Accounts:';
PRINT '-------------------';
PRINT 'Admin:   Username: admin   | Password: admin123   | Role: Admin';
PRINT 'Buyer1:  Username: bhavya | Password: bhavya123  | Role: Buyer';
PRINT 'Buyer2:  Username: utsav  | Password: utsav123   | Role: Buyer';
PRINT 'Seller1: Username: vishvas| Password: vishvas123 | Role: Seller (5 cars, 1 sold)';
PRINT 'Seller2: Username: krish  | Password: krish123   | Role: Seller (3 cars)';
PRINT 'Seller3: Username: arjun  | Password: arjun123   | Role: Seller (4 cars)';
PRINT '';
PRINT '=============================================';
PRINT 'You can now login and test the application!';
PRINT '=============================================';
GO