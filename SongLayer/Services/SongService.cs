using System.Net;
using Microsoft.EntityFrameworkCore;
using MyMusicApp.Interfaces;
using MyMusicApp.Models;

namespace MyMusicApp.Services;

public class SongService : ISongService
{
    private readonly MusicDbContext _context;
    private readonly HttpClient _httpClient;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public SongService(MusicDbContext context, IHttpClientFactory httpClientFactory,
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


    public async Task AddSongAsync(SongCreateModel song)
    {
        if (!string.IsNullOrWhiteSpace(song.SongEncoded) && !string.IsNullOrWhiteSpace(song.CoverEncoded) &&
            !string.IsNullOrWhiteSpace(song.UserId) && !string.IsNullOrWhiteSpace(song.Name))
        {
            if (!Guid.TryParse(song.UserId, out _))
                throw new Exception("Invalid UserId");

            var path = $"./Songs/{song.Name}-{song.UserId}.mp3";
            var directoryPath = Path.Combine("./Songs");
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }
            File.Create(path).Close();
            var bytes = Convert.FromBase64String(song.SongEncoded);
            await File.WriteAllBytesAsync(path, bytes);
            var songResult = new Song
            {
                Name = song.Name,
                UserId = song.UserId,
                CoverEncoded = song.CoverEncoded,
                SongPath = path
            };
            await _context.Songs.AddAsync(songResult);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<string> UpdateSongAsync(SongUpdateModel song)
    {
        var songToUpdate = await _context.Songs.FindAsync(song.Id);

        if (songToUpdate == null)
            throw new Exception("Song not found");

        if (!string.IsNullOrWhiteSpace(song.Name))
            songToUpdate.Name = song.Name;

        if (!string.IsNullOrWhiteSpace(song.CoverEncoded))
            songToUpdate.CoverEncoded = song.CoverEncoded;

        await _context.SaveChangesAsync();

        return "Song updated successfully!";
    }

    public async Task DeleteSongAsync(int id)
    {
        var songToDelete = await _context.Songs.FindAsync(id);
        if (songToDelete != null) _context.Songs.Remove(songToDelete);
            throw new Exception("Song not found");
    }

    public async Task<List<Song>> GetSongsAsync()
    {
        var result = await _context.Songs.ToListAsync();
        foreach (var t in result)
        {
            var response = await _httpClient.GetAsync($"http://auth-layer:8080/auth/getUsernameById?id={t.UserId}");
            t.UserId = response.IsSuccessStatusCode
                ? await response.Content.ReadAsStringAsync()
                : "Unknown";
            var bytes = await File.ReadAllBytesAsync(t.SongPath);
            t.SongPath = Convert.ToBase64String(bytes);
        }

        return result;
    }

    public async Task<Song> GetSongById(int id)
    {
        var song = await _context.Songs.FindAsync(id);
        return song ?? throw new Exception("Song not found");
    }

    public async Task<List<Song>> GetAllPersonal(string userId)
    {
        var result = await _context.Songs.Where(s => s.UserId == userId).ToListAsync();
        foreach (var t in result)
        {
            var response = await _httpClient.GetAsync($"http://auth-layer:8080/auth/getUsernameById?id={t.UserId}");
            t.UserId = response.IsSuccessStatusCode
                ? await response.Content.ReadAsStringAsync()
                : "Unknown";
            var bytes = await File.ReadAllBytesAsync(t.SongPath);
            t.SongPath = Convert.ToBase64String(bytes);
        }

        return result;
    }
}