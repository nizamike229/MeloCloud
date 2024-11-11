using AuthLayer.Models;

namespace AuthLayer.Interfaces;

public interface IAuthService
{
    Task<User> LoginAsync(UserLoginRequest request);
    Task<User> RegisterAsync(UserLoginRequest request);
    Task Edit(EditModel request);
    Task<UserResponse> GetPersonalInfoAsync(string id);
    Task<bool> IsUserExistAsync(Guid id);
    Task<string> GetUsernameByIdAsync(string id);
}
