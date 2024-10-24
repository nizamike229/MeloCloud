using System.ComponentModel.DataAnnotations;

namespace AuthLayer.Models;

public class UserLoginRequest
{
    [MinLength(2)]
    public required string Username { get; set; }
    
    [MinLength(8)]
    public required string Password { get; set; }
}
