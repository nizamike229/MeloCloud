namespace MyMusicApp.Model;

public partial class Song
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Artists { get; set; } = null!;

    public string SongPath{ get; set; } = null!;

    public string CoverEncoded { get; set; } = null!;
}