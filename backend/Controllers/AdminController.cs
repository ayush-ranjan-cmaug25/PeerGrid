using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PeerGrid.Backend.Data;
using PeerGrid.Backend.Models;

namespace PeerGrid.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Admin/users
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // DELETE: api/Admin/users/5
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> BanUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User banned/deleted successfully" });
        }

        // PUT: api/Admin/users/5
        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            if (id != user.Id) return BadRequest();

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null) return NotFound();

            existingUser.Role = user.Role;
            existingUser.IsVerifiedTutor = user.IsVerifiedTutor;
            // Update other fields as needed

            await _context.SaveChangesAsync();
            return Ok(new { message = "User updated successfully" });
        }

        // GET: api/Admin/sessions
        [HttpGet("sessions")]
        public async Task<ActionResult<IEnumerable<Session>>> GetAllSessions()
        {
            return await _context.Sessions.Include(s => s.Tutor).Include(s => s.Learner).ToListAsync();
        }
    }
}
