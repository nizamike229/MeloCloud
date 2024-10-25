using System.Security.Claims;
using AuthLayer.Interfaces;
using AuthLayer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthLayer.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class AuthController : ControllerBase
{
    private readonly ITokenService _tokenService;
    private readonly IAuthService _authService;

    public AuthController(ITokenService tokenService, IAuthService authService)
    {
        _tokenService = tokenService;
        _authService = authService;
    }

    [HttpPost]
    [ActionName("register")]
    public async Task<ActionResult<User>> RegisterAsync([FromBody] UserLoginRequest request)
    {
        return Ok(await _authService.RegisterAsync(request));
    }

    [HttpPost]
    [ActionName("login")]
    public async Task<ActionResult<User>> LoginAsync([FromBody] UserLoginRequest request)
    {
        var user = await _authService.LoginAsync(request);
        var token = _tokenService.GenerateJwtToken(user.Username, user.Id);

        Response.Cookies.Append("access_token", token, new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.None,
            Secure = true
        });

        return Ok(user);
    }

    [Authorize]
    [HttpGet]
    [ActionName("personal")]
    public async Task<ActionResult<UserResponse>> Personal()
    {
        return Ok(await _authService.GetPersonalInfoAsync(User.FindFirstValue(ClaimTypes.Sid)!));
    }

    [Authorize]
    [HttpPatch]
    [ActionName("edit")]
    public async Task<ActionResult<string>> Edit(EditModel request)
    {
        request.Id=User.FindFirstValue(ClaimTypes.Sid)!;
        await _authService.Edit(request);
        return Ok("User edited successfully!");
    }

    [Authorize]
    [HttpGet]
    [ActionName("getUsernameById")]
    public async Task<ActionResult<string>> GetUsernameById([FromQuery]string id)
    {
        return Ok(await _authService.GetUsernameByIdAsync(id));
    }

    [Authorize]
    [HttpPost]
    [ActionName("logOut")]
    public ActionResult Logout()
    {
        Response.Cookies.Delete("access_token");
        return Ok();
    }
}