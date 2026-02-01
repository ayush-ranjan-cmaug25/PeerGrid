using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PeerGrid.Backend.Data;
using PeerGrid.Backend.Models;
using PeerGrid.Backend.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PeerGrid.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Users/me
        [HttpGet("me")]
        public async Task<ActionResult<UserDto>> GetMe()
        {
            try
            {
                var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (idClaim == null) return Unauthorized();
                
                var userId = int.Parse(idClaim?.Value ?? "0");
                var user = await _context.Users.FindAsync(userId);

                if (user == null)
                {
                    return NotFound();
                }

                // Calculate Stats
                var totalSessions = await _context.Sessions.CountAsync(s => (s.TutorId == userId || s.LearnerId == userId) && s.Status == "Completed");
                
                // Calculate hours taught
                var hoursTaught = await _context.Sessions
                    .Where(s => s.TutorId == userId && s.Status == "Completed")
                    .Select(s => EF.Functions.DateDiffMinute(s.StartTime, s.EndTime) / 60.0)
                    .SumAsync();

                var averageRating = await _context.Transactions
                    .Where(t => t.TutorId == userId && t.Rating.HasValue)
                    .AverageAsync(t => t.Rating) ?? 0;

                var recentSessions = await _context.Sessions
                    .Include(s => s.Tutor)
                    .Include(s => s.Learner)
                    .Where(s => s.TutorId == userId || s.LearnerId == userId)
                    .OrderByDescending(s => s.StartTime)
                    .Take(3)
                    .Select(s => new SessionDto
                    {
                        Id = s.Id,
                        Topic = s.Topic,
                        OtherParty = s.TutorId == userId ? s.Learner!.Name : s.Tutor!.Name,
                        Time = s.StartTime,
                        Status = s.Status
                    })
                    .ToListAsync();

                // Calculate Badges
                var badges = new List<string>();
                if (totalSessions >= 5 && averageRating >= 4.0)
                {
                    badges.Add("Verified Peer");
                }

                var topSkills = await _context.Sessions
                    .Where(s => s.TutorId == userId && s.Status == "Completed")
                    .GroupBy(s => s.Topic)
                    .Select(g => new { Topic = g.Key, Count = g.Count() })
                    .Where(x => x.Count >= 3)
                    .ToListAsync();

                foreach (var skill in topSkills)
                {
                    badges.Add($"{skill.Topic} Specialist");
                }

                return new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role,
                    Bio = user.Bio,
                    ProfilePictureUrl = user.ProfilePictureUrl,
                    SkillsOffered = user.SkillsOffered,
                    SkillsNeeded = user.SkillsNeeded,
                    GridPoints = user.GridPoints,
                    LockedPoints = user.LockedPoints,
                    IsAvailable = user.IsAvailable,
                    TotalSessions = totalSessions,
                    HoursTaught = Math.Round(hoursTaught, 1),
                    AverageRating = Math.Round(averageRating, 1),
                    RecentSessions = recentSessions,
                    Badges = badges
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetMe: {ex}");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // GET: api/Users/dashboard
        [HttpGet("dashboard")]
        public async Task<ActionResult<object>> GetDashboardStats()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (idClaim == null) return Unauthorized();
            var userId = int.Parse(idClaim?.Value ?? "0");

            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound();

            var upcomingSessions = await _context.Sessions
                .Include(s => s.Tutor)
                .Include(s => s.Learner)
                .Where(s => (s.LearnerId == userId || s.TutorId == userId) && s.Status == "Confirmed" && s.StartTime > DateTime.UtcNow)
                .OrderBy(s => s.StartTime)
                .Take(5)
                .Select(s => new {
                    Id = s.Id,
                    Topic = s.Topic,
                    OtherParty = s.TutorId == userId ? s.Learner!.Name : s.Tutor!.Name,
                    Time = s.StartTime,
                    Status = s.Status
                })
                .ToListAsync();

            var activeDoubts = await _context.Sessions
                .Where(s => s.Status == "Open")
                .OrderByDescending(s => s.Id)
                .Take(5)
                .Select(s => new {
                    Id = s.Id,
                    Title = s.Title,
                    Description = s.Description,
                    Points = s.Cost,
                    Tags = new[] { s.Topic } // Simplified for now
                })
                .ToListAsync();

            return new
            {
                User = user,
                UpcomingSessions = upcomingSessions,
                ActiveDoubts = activeDoubts
            };
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/me
        [HttpPut("me")]
        public async Task<IActionResult> UpdateProfile(User updatedUser)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (idClaim == null) return Unauthorized();
            var userId = int.Parse(idClaim?.Value ?? "0");

            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound();

            user.SkillsOffered = updatedUser.SkillsOffered;
            user.SkillsNeeded = updatedUser.SkillsNeeded;
            user.Bio = updatedUser.Bio;
            user.Name = updatedUser.Name;
            user.ProfilePictureUrl = updatedUser.ProfilePictureUrl;


            await _context.SaveChangesAsync();
            return Ok(user);
        }

        // GET: api/Users/top-solvers
        [HttpGet("top-solvers")]
        [AllowAnonymous] 
        public async Task<ActionResult<IEnumerable<UserDto>>> GetTopSolvers()
        {
            var topSolvers = await _context.Users
                .OrderByDescending(u => u.GridPoints)
                .Take(5)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    ProfilePictureUrl = u.ProfilePictureUrl,
                    GridPoints = u.GridPoints
                })
                .ToListAsync();

            return Ok(topSolvers);
        }
    }
}
