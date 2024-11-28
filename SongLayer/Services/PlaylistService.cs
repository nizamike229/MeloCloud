using System.Net;
using System.Text;
using Microsoft.EntityFrameworkCore;
using MyMusicApp.Interfaces;
using MyMusicApp.Models;

namespace MyMusicApp.Services;

public class PlaylistService : IPlaylistService
{
    private readonly MusicDbContext _context;
    private readonly HttpClient _httpClient;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public PlaylistService(MusicDbContext context, IHttpClientFactory httpClientFactory,
        IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpClient = httpClientFactory.CreateClient("AuthClient");
        _httpContextAccessor = httpContextAccessor;

        var cookieContainer = new CookieContainer();
        var handler = new HttpClientHandler { CookieContainer = cookieContainer };
        _httpClient = new HttpClient(handler);

        if (_httpContextAccessor.HttpContext?.Request.Cookies.TryGetValue("access_token", out var token) == true)
        {
            cookieContainer.Add(new Uri("http://auth-layer:8080"), new Cookie("access_token", token));
        }
    }

    public async Task CreatePlaylistAsync(PlaylistCreateModel request)
    {
        var response = _httpClient.PostAsync("http://auth-layer:8080/auth/isUserExists",
            new StringContent($"userId={request.Name}", Encoding.UTF8, "application/json")).Result;
        var responseString = await response.Content.ReadAsStringAsync();
        if (responseString == "false")
            throw new Exception("User does not exist");

        _context.Playlists.Add(new Playlist
        {
            Name = request.Name,
            UserId = request.UserId
        });
        await _context.SaveChangesAsync();
    }

    public async Task DeletePlaylistAsync(int id)
    {
        var playlist = await _context.Playlists.FirstOrDefaultAsync(p => p.Id == id);
        _context.Playlists.Remove(playlist!);
    }

    public async Task AddSongToPlaylistAsync(int songId, int playlistId)
    {
        var song = await _context.Songs.FirstOrDefaultAsync(s => s.Id == songId);
        if (song is null)
            throw new Exception("Song does not exist");
        var playlist = await _context.Playlists.FirstOrDefaultAsync(p => p.Id == playlistId);
        playlist!.Songs.Add(song);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Playlist>> GetAllPlaylistsAsync()
    {
        var result = await _context.Playlists.Include(playlist => playlist.Songs).ToListAsync();
        foreach (var t in result)
        {
            var response = await _httpClient.GetAsync($"http://auth-layer:8080/auth/getUsernameById?id={t.UserId}");
            t.UserId = response.IsSuccessStatusCode
                ? await response.Content.ReadAsStringAsync()
                : "Unknown";
            foreach (var s in t.Songs)
            {
                var songResponse =
                    await _httpClient.GetAsync($"http://auth-layer:8080/auth/getUsernameById?id={s.UserId}");
                s.UserId = response.IsSuccessStatusCode
                    ? await songResponse.Content.ReadAsStringAsync()
                    : "Unknown";
                var bytes = await File.ReadAllBytesAsync(s.SongPath);
                s.SongPath = Convert.ToBase64String(bytes);
            }
        }

        return result;
    }

    public async Task<List<Playlist>> GetPersonalPlaylistsAsync(string id)
    {
        var playlists = await GetAllPlaylistsAsync();
        return playlists.Where(p => p.UserId == id).ToList();
    }
}