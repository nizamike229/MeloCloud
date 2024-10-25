using AuthLayer.Interfaces;
using AuthLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthLayer.Services;

public class AuthService : IAuthService
{
    private readonly AuthLayerContext _context;

    public AuthService(AuthLayerContext context)
    {
        _context = context;
    }

    public async Task<User> LoginAsync(UserLoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);

        if (user == null)
            throw new Exception("Invalid username or password");

        if (IsValidPassword(request.Password, user.Password))
            return user;

        throw new Exception("Invalid username or password");
    }

    public async Task<User> RegisterAsync(UserLoginRequest request)
    {
        var isUsernameFree = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username) == null;
        if (!isUsernameFree)
            throw new Exception("Username already taken");

        var user = new User()
        {
            Logo = "https://i.pinimg.com/736x/0c/da/40/0cda4058d21f8101ffcc223eec55c18f.jpg",
            Id = Guid.NewGuid(),
            Username = request.Username,
            Password = HashPassword(request.Password)
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task Edit(EditModel request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == Guid.Parse(request.Id!));
        if (request.Username != null)
        {
            var isUsernameFree = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username) == null;
            user!.Username = isUsernameFree ? request.Username : throw new Exception("Username already taken");
        }

        if (request.Logo != null)
            user!.Logo = request.Logo;

        await _context.SaveChangesAsync();
    }

    public async Task<UserResponse> GetPersonalInfoAsync(string id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == Guid.Parse(id));

        return user == null ? throw new Exception("Invalid user id") : new UserResponse
        {
            Username = user.Username,
            Logo = user.Logo
        };
    }

    public async Task<string> GetUsernameByIdAsync(string id)
    {
        var result= (await _context.Users.FirstOrDefaultAsync(u => u.Id == Guid.Parse(id)))!.Username;
        return result;
    }

    private string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.EnhancedHashPassword(password, 13);
    }

    private bool IsValidPassword(string inputPassword, string actualPassword)
    {
        return BCrypt.Net.BCrypt.EnhancedVerify(inputPassword, actualPassword);
    }
}