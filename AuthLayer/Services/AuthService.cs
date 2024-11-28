using AuthLayer.Interfaces;
using AuthLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthLayer.Services;

public class AuthService : IAuthService
{
    private readonly AuthLayerContext _context;
    private const string DefaultLogoUrl = "https://i.pinimg.com/736x/0c/da/40/0cda4058d21f8101ffcc223eec55c18f.jpg";
    private const int BcryptWorkFactor = 13;

    public AuthService(AuthLayerContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<User> LoginAsync(UserLoginRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);
        
        var user = await GetUserByUsernameAsync(request.Username);
        if (!IsValidPassword(request.Password, user.Password))
        {
            throw new UnauthorizedException("Invalid username or password");
        }
        
        return user;
    }

    public async Task<User> RegisterAsync(UserLoginRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);
        
        await EnsureUsernameIsUniqueAsync(request.Username);

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Password = HashPassword(request.Password),
            Logo = DefaultLogoUrl
        };

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task Edit(EditModel request)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentNullException.ThrowIfNull(request.Id);

        var user = await GetUserByIdAsync(Guid.Parse(request.Id));

        if (request.Username is not null)
        {
            await EnsureUsernameIsUniqueAsync(request.Username);
            user.Username = request.Username;
        }

        if (request.Logo is not null)
        {
            user.Logo = request.Logo;
        }

        await _context.SaveChangesAsync();
    }

    public async Task<UserResponse> GetPersonalInfoAsync(string id)
    {
        ArgumentNullException.ThrowIfNull(id);

        var user = await GetUserByIdAsync(Guid.Parse(id));
        
        return new UserResponse
        {
            Username = user.Username,
            Logo = user.Logo
        };
    }

    public async Task<string> GetUsernameByIdAsync(string id)
    {
        ArgumentNullException.ThrowIfNull(id);
        
        var user = await GetUserByIdAsync(Guid.Parse(id));
        return user.Username;
    }

    public async Task<bool> IsUserExistAsync(Guid id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        return user != null ? true : throw new NotFoundException("User not found");
    }

    private async Task<User> GetUserByIdAsync(Guid id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        return user ?? throw new NotFoundException($"User with ID {id} not found");
    }

    private async Task<User> GetUserByUsernameAsync(string username)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        return user ?? throw new NotFoundException("Invalid username or password");
    }

    private async Task EnsureUsernameIsUniqueAsync(string username)
    {
        var exists = await _context.Users.AnyAsync(u => u.Username == username);
        if (exists)
        {
            throw new ConflictException("Username already taken");
        }
    }

    private static string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.EnhancedHashPassword(password, BcryptWorkFactor);
    }

    private static bool IsValidPassword(string inputPassword, string actualPassword)
    {
        return BCrypt.Net.BCrypt.EnhancedVerify(inputPassword, actualPassword);
    }
}

public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message) : base(message) { }
}

public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }
}

public class ConflictException : Exception
{
    public ConflictException(string message) : base(message) { }
}