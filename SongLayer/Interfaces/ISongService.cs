using MyMusicApp.Models;

namespace MyMusicApp.Interfaces;

public interface ISongService
{
    Task AddSongAsync(SongCreateModel song);
    Task<string> UpdateSongAsync(SongUpdateModel song);
    Task DeleteSongAsync(int id);
    Task<List<Song>> GetSongsAsync();
    Task<Song> GetSongById(int id);
}