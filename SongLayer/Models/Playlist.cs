namespace MyMusicApp.Models;

public partial class Playlist
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string UserId { get; set; } = null!;

    public virtual ICollection<Song> Songs { get; set; } = new List<Song>();
}
