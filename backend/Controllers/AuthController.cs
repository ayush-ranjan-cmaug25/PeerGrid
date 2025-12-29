using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PeerGrid.Backend.Data;
using PeerGrid.Backend.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Google.Apis.Auth;

namespace PeerGrid.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                return BadRequest("Email already exists");
            }

            // In a real app, use a proper password hasher like BCrypt or Argon2
            // For this prototype, we'll simulate hashing
            user.PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes(user.PasswordHash)); 
            
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            
            // Verify password (simulated hash check)
            if (user == null || user.PasswordHash != Convert.ToBase64String(Encoding.UTF8.GetBytes(request.Password)))
            {
                return Unauthorized("Invalid credentials");
            }

            var token = GenerateJwtToken(user);
            return Ok(new { token, role = user.Role, user });
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            Console.WriteLine($"Received Google Login Request. Token length: {request.IdToken?.Length}");
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string>() { "308348501964-j00m5qv6n7a3905oan7oqf1305f8dn01.apps.googleusercontent.com" }
                };
                
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, settings);
                Console.WriteLine($"Token validated for email: {payload.Email}");
                
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == payload.Email);
                if (user == null)
                {
                    Console.WriteLine("User not found, creating new user.");
                    user = new User
                    {
                        Email = payload.Email,
                        Name = payload.Name,
                        Role = "User",
                        PasswordHash = Convert.ToBase64String(Guid.NewGuid().ToByteArray()), // Random password
                        GridPoints = 100,
                        IsAvailable = true,
                        ProfilePictureUrl = payload.Picture // Use Google profile picture
                    };
                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                }

                var token = GenerateJwtToken(user);
                return Ok(new { token, role = user.Role, user });
            }
            catch (InvalidJwtException ex)
            {
                Console.WriteLine($"InvalidJwtException: {ex.Message}");
                return BadRequest($"Invalid Google Token: {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in GoogleLogin: {ex}");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        private string GenerateJwtToken(User user)
        {
            var jwtKey = _configuration["Jwt:Key"] ?? "REDACTED_JWT_SECRET";
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "PeerGrid",
                audience: _configuration["Jwt:Audience"] ?? "PeerGridUsers",
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class GoogleLoginRequest
    {
        public string IdToken { get; set; }
    }
}
