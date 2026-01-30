using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PeerGrid.Backend.Data;
using PeerGrid.Backend.Models;
using PeerGrid.Backend.Services;
using System.Security.Claims;

namespace PeerGrid.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebinarsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public WebinarsController(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // GET: api/Webinars
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Webinar>>> GetWebinars()
        {
            return await _context.Webinars
                .Include(w => w.Host)
                .Include(w => w.RegisteredUsers) // We need this to check registration status
                .Where(w => w.ScheduledTime > DateTime.Now)
                .OrderBy(w => w.ScheduledTime)
                .ToListAsync();
        }

        // POST: api/Webinars
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Webinar>> CreateWebinar(Webinar webinar)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound("User not found");

            webinar.HostId = userId;
            // Ensure time is future
            if (webinar.ScheduledTime < DateTime.Now)
            {
                return BadRequest("Cannot schedule webinar in the past.");
            }

            _context.Webinars.Add(webinar);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWebinars", new { id = webinar.Id }, webinar);
        }

        // POST: api/Webinars/5/register
        [HttpPost("{id}/register")]
        [Authorize]
        public async Task<IActionResult> RegisterForWebinar(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("User not found");

            var webinar = await _context.Webinars.Include(w => w.RegisteredUsers).FirstOrDefaultAsync(w => w.Id == id);
            if (webinar == null) return NotFound("Webinar not found");

            if (webinar.RegisteredUsers.Any(u => u.Id == userId))
            {
                return BadRequest("Already registered.");
            }

            if (user.GridPoints < webinar.Cost)
            {
                return BadRequest("Insufficient Grid Points.");
            }

            // Deduct Points
            user.GridPoints -= webinar.Cost;
            
            // Add to webinar
            webinar.RegisteredUsers.Add(user);

            await _context.SaveChangesAsync();

            // Send Email
            _emailService.SendWebinarRegistrationEmail(
                user.Email,
                user.Name,
                webinar.Title,
                webinar.ScheduledTime.ToString(),
                webinar.MeetingLink ?? "Link will be shared soon"
            );

            return Ok(new { message = "Registered successfully!", newBalance = user.GridPoints });
        }
    }
}
