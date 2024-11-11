using System.Text.Json.Serialization;

namespace MyMusicApp.Models;

public sealed class Song
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public required string SongPath { get; set; }

    public required string CoverEncoded { get; set; }

    public string? UserId { get; set; }

    [JsonIgnore]
    public ICollection<Playlist> Playlists { get; set; } = new List<Playlist>();
}
