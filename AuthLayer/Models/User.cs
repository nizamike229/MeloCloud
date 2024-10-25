namespace AuthLayer.Models;

public class User
{
    public Guid Id { get; set; }

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;
    public string Logo { get; set; }
}
