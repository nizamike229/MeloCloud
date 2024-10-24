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
            Id = Guid.NewGuid(),
            Username = request.Username,
            Password = HashPassword(request.Password)
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
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
