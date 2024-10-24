using MyMusicApp.Model;

namespace MyMusicApp.Interfaces;

public interface ISongService
{
    Task AddSongAsync(SongCreateModel song);
    Task<string> UpdateSongAsync(Song song);
    Task DeleteSongAsync(int id);
    Task<List<Song>> GetSongsAsync();
    Task<Song> GetSongById(int id);
}