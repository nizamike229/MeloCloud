using Microsoft.EntityFrameworkCore;
using MyMusicApp.Interfaces;
using MyMusicApp.Model;

namespace MyMusicApp.Services;

public class SongService : ISongService
{
    private readonly MusicDbContext _context;

    public SongService(MusicDbContext context)
    {
        _context = context;
    }


    public async Task AddSongAsync(SongCreateModel song)
    {
        if (!string.IsNullOrWhiteSpace(song.SongEncoded) && !string.IsNullOrWhiteSpace(song.CoverEncoded) &&
            !string.IsNullOrWhiteSpace(song.Artists) && !string.IsNullOrWhiteSpace(song.Name))
        {
            string path = $@"./Songs/{song.Name}-{song.Artists}.mp3";
            File.Create(path).Close();
            var bytes= Convert.FromBase64String(song.SongEncoded);
            await File.WriteAllBytesAsync(path,bytes);
            var songResult = new Song()
            {
                Name = song.Name,
                Artists = song.Artists,
                CoverEncoded = song.CoverEncoded,
                SongPath = path
            };
            await _context.Songs.AddAsync(songResult);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<string> UpdateSongAsync(Song song)
    {
        var songToUpdate = await _context.Songs.FindAsync(song.Id);

        if (songToUpdate == null)
            throw new Exception("Song not found");

        if (!string.IsNullOrWhiteSpace(song.Name))
            songToUpdate!.Name = song.Name;

        if (!string.IsNullOrWhiteSpace(song.Artists))
            songToUpdate!.Artists = song.Artists;

        if (!string.IsNullOrWhiteSpace(song.SongPath))
            songToUpdate!.SongPath = song.SongPath;

        if (!string.IsNullOrWhiteSpace(song.CoverEncoded))
            songToUpdate!.CoverEncoded = song.CoverEncoded;

        await _context.SaveChangesAsync();

        return "Song updated successfully!";
    }

    public async Task DeleteSongAsync(int id)
    {
        var songToDelete = await _context.Songs.FindAsync(id);
        if (songToDelete != null) _context.Songs.Remove(songToDelete);
    }

    public async Task<List<Song>> GetSongsAsync()
    {
        var result= await _context.Songs.ToListAsync();
        foreach (var t in result)
        {
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
}