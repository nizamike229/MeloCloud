using MyMusicApp.Models;

namespace MyMusicApp.Interfaces;

public interface IPlaylistService
{
    Task CreatePlaylistAsync(PlaylistCreateModel request);
    Task DeletePlaylistAsync(int id);
    Task AddSongToPlaylistAsync(int songId,int playlistId);
    Task<List<Playlist>> GetAllPlaylistsAsync();
    Task<List<Playlist>> GetPersonalPlaylistsAsync(string id);
}