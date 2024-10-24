using AuthLayer.Models;

namespace AuthLayer.Interfaces;

public interface IAuthService
{
    Task<User> LoginAsync(UserLoginRequest request);
    Task<User> RegisterAsync(UserLoginRequest request);
}
