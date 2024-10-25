namespace MyMusicApp.Models;

public class SongUpdateModel
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;
    
    public string CoverEncoded { get; set; } = null!;
}