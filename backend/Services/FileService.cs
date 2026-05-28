namespace SecondHandCarSelling.Services
{
    public interface IFileService
    {
        Task<string> UploadFileAsync(IFormFile file, string subFolder);
        void DeleteFile(string? relativePath);
    }

    public class FileService : IFileService
    {
        private readonly string _basePath;
        private readonly string _filesFolder = "Files";

        public FileService()
        {
            _basePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", _filesFolder);
        }

        public async Task<string> UploadFileAsync(IFormFile file, string subFolder)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty");

            // Validate file type (optional but recommended)
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
                throw new ArgumentException($"Invalid file type. Allowed: {string.Join(", ", allowedExtensions)}");

            // Validate size (redundant with FormOptions but good practice)
            if (file.Length > 15 * 1024 * 1024)
                throw new ArgumentException("File exceeds 15MB");

            var folderPath = Path.Combine(_basePath, subFolder);
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Path.Combine(_filesFolder, subFolder, fileName); // Relative path for DB
        }

        public void DeleteFile(string? relativePath)
        {
            if (string.IsNullOrEmpty(relativePath)) return;

            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", relativePath);
            if (File.Exists(fullPath))
            {
                try
                {
                    File.Delete(fullPath);
                }
                catch (Exception ex)
                {
                    // Log error (e.g., use ILogger); don't throw to avoid blocking operations
                    Console.WriteLine($"Failed to delete file: {fullPath}. Error: {ex.Message}");
                }
            }
        }
    }
}
