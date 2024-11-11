using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyMusicApp.Interfaces;
using MyMusicApp.Models;

namespace MyMusicApp.Controllers;

[Authorize]
[ApiController]
[Route("[controller]/[action]")]
public class SongController : ControllerBase
{
    private readonly ISongService _songService;

    public SongController(ISongService songService)
    {
        _songService = songService;
    }

    [HttpGet]
    [ActionName("all")]
    public async Task<ActionResult<List<Song>>> GetSongsAsync()
    {
        var result = await _songService.GetSongsAsync();
        return Ok(result);
    }

    [HttpPost]
    [ActionName("create")]
    public async Task<ActionResult<string>> CreateSongAsync(SongCreateModel request)
    {
        request.UserId = User.FindFirstValue(ClaimTypes.Sid)!;
        await _songService.AddSongAsync(request);
        return Ok("Song created successfully!");
    }

    [HttpGet]
    [ActionName("personal")]
    public async Task<ActionResult<List<Song>>> GetAllPersonalSongsAsync()
    {
        var userId=User.FindFirstValue(ClaimTypes.Sid);
        return Ok(await _songService.GetAllPersonal(userId!));
    }
}