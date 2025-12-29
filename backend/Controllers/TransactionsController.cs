using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PeerGrid.Backend.Data;
using PeerGrid.Backend.Models;
using System.Security.Claims;

namespace PeerGrid.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TransactionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TransactionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Transactions/my
        [HttpGet("my")]
        public async Task<ActionResult<object>> GetMyTransactions()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();
            var userId = int.Parse(userIdStr);

            var transactions = await _context.Transactions
                .Include(t => t.Learner)
                .Include(t => t.Tutor)
                .Where(t => t.LearnerId == userId || t.TutorId == userId)
                .OrderByDescending(t => t.Timestamp)
                .Select(t => new {
                    t.Id,
                    t.Timestamp,
                    t.Points,
                    t.Skill,
                    Type = t.TutorId == userId ? "Earned" : "Spent",
                    OtherPartyName = t.TutorId == userId ? t.Learner.Name : t.Tutor.Name
                })
                .ToListAsync();

            return transactions;
        }
    }
}
