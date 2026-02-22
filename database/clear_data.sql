-- =============================================
-- Second Hand Car Selling Database - Clear All Data
-- =============================================
-- This script deletes ALL data from all tables
-- Use with caution! This cannot be undone.
-- =============================================

USE CarSelling;
GO

PRINT '=============================================';
PRINT 'CLEARING ALL DATA FROM DATABASE';
PRINT '=============================================';
PRINT '';

-- =============================================
-- STEP 1: DELETE ALL DATA (respecting foreign key constraints)
-- Delete child tables first (tables with foreign keys)
-- =============================================

PRINT 'Deleting data from child tables...';

DELETE FROM Purchase;
PRINT '  - Purchase table cleared';

DELETE FROM Review;
PRINT '  - Review table cleared';

DELETE FROM CarImages;
PRINT '  - CarImages table cleared';

DELETE FROM Car;
PRINT '  - Car table cleared';

DELETE FROM [User];
PRINT '  - User table cleared';

-- Delete lookup/reference tables
DELETE FROM CarStatus;
PRINT '  - CarStatus table cleared';

DELETE FROM CarBrand;
PRINT '  - CarBrand table cleared';

PRINT '';
PRINT 'All table data deleted.';
PRINT '';

-- =============================================
-- STEP 2: RESET IDENTITY COLUMNS
-- =============================================

PRINT 'Resetting identity columns...';

DBCC CHECKIDENT ('Purchase', RESEED, 0);
DBCC CHECKIDENT ('Review', RESEED, 0);
DBCC CHECKIDENT ('CarImages', RESEED, 0);
DBCC CHECKIDENT ('Car', RESEED, 0);
DBCC CHECKIDENT ('[User]', RESEED, 0);
DBCC CHECKIDENT ('CarStatus', RESEED, 0);
DBCC CHECKIDENT ('CarBrand', RESEED, 0);

PRINT '  - All identity columns reset to 0';
PRINT '';

-- =============================================
-- VERIFICATION
-- =============================================

PRINT '=============================================';
PRINT 'VERIFICATION - All tables should show 0 rows';
PRINT '=============================================';
PRINT '';

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
SELECT 'Reviews', COUNT(*) FROM Review
UNION ALL
SELECT 'Car Images', COUNT(*) FROM CarImages;

PRINT '';
PRINT '=============================================';
PRINT 'DATABASE CLEARED SUCCESSFULLY!';
PRINT '=============================================';
GO
