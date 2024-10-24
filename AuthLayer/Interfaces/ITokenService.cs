namespace AuthLayer.Interfaces;

public interface ITokenService
{
    public string GenerateJwtToken(string username,Guid id);
}
