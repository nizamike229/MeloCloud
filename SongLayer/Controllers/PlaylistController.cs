using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyMusicApp.Interfaces;
using MyMusicApp.Models;

namespace MyMusicApp.Controllers;

[Authorize]
[ApiController]
[Route("[controller]/[action]")]
public class PlaylistController : ControllerBase
{
    private readonly IPlaylistService _service;

    public PlaylistController(IPlaylistService service)
    {
        _service = service;
    }

    [HttpGet]
    [ActionName("getAll")]
    public async Task<ActionResult<List<Playlist>>> GetAllPlaylistsAsync()
    {
        return Ok(await _service.GetAllPlaylistsAsync());
    }

    [HttpPost]
    [ActionName("create")]
    public async Task<ActionResult<string>> CreatePlaylistAsync(PlaylistCreateModel playlist)
    {
        playlist.UserId = User.FindFirstValue(ClaimTypes.Sid)!;
        await _service.CreatePlaylistAsync(playlist);
        return Ok("Playlist created successfully!");
    }

    [HttpPost]
    [ActionName("addSongToPlaylist")]
    public async Task<ActionResult<string>> AddSongToPlaylistAsync(SongAddModel request)
    {
        await _service.AddSongToPlaylistAsync(request.SongId, request.PlaylistId);
        return Ok("Song added successfully!");
    }

    [HttpGet]
    [ActionName("personal")]
    public async Task<ActionResult<List<Playlist>>> PersonalPlaylistAsync()
    {
        var userId = User.FindFirstValue(ClaimTypes.Sid)!;
        return Ok(await _service.GetPersonalPlaylistsAsync(User.FindFirstValue(userId)!));
    }
}