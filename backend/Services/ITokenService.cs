namespace SecondHandCarSellingAPI.Services
{
    public interface ITokenService
    {
        string GenerateToken(string userName, string role, string userId);
    }
}
