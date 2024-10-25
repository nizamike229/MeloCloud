namespace MyMusicApp.Models;

public class SongCreateModel
{
    public required string Name { get; set; } = null!;

    public required string UserId { get; set; } = null!;

    public required string SongEncoded { get; set; } = null!;
    
    public required string CoverEncoded { get; set; } = null!;
}