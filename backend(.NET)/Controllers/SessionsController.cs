using Microsoft.AspNetCore.Mvc;
using PeerGrid.Backend.Services;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using PeerGrid.Backend.Data;
using System.Linq;
using System.Security.Claims;

namespace PeerGrid.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SessionsController : ControllerBase
    {
        private readonly SessionService _sessionService;
        private readonly ApplicationDbContext _context;

        public SessionsController(SessionService sessionService, ApplicationDbContext context)
        {
            _sessionService = sessionService;
            _context = context;
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMySessions()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var sessions = await _context.Sessions
                .Include(s => s.Tutor)
                .Include(s => s.Learner)
                .Where(s => s.TutorId == userId || s.LearnerId == userId)
                .OrderByDescending(s => s.StartTime)
                .Select(s => new {
                    Id = s.Id,
                    Topic = s.Topic,
                    Title = s.Title,
                    Description = s.Description,
                    OtherParty = s.TutorId == userId ? s.Learner.Name : (s.Tutor != null ? s.Tutor.Name : "Open"),
                    OtherPartyId = s.TutorId == userId ? s.LearnerId : s.TutorId,
                    LearnerId = s.LearnerId,
                    TutorId = s.TutorId,
                    Time = s.StartTime,
                    Status = s.Status,
                    Cost = s.Cost
                })
                .ToListAsync();

            return Ok(sessions);
        }

        [HttpGet("doubts")]
        public async Task<IActionResult> GetDoubts()
        {
            var doubts = await _context.Sessions
                .Include(s => s.Learner)
                .Where(s => s.Status == "Open")
                .OrderByDescending(s => s.Id)
                .Select(s => new {
                    Id = s.Id,
                    Title = s.Title,
                    Description = s.Description,
                    Topic = s.Topic,
                    Points = s.Cost,
                    Learner = s.Learner.Name,
                    LearnerId = s.LearnerId, // Added LearnerId for frontend check
                    Tags = new[] { s.Topic }
                })
                .ToListAsync();

            return Ok(doubts);
        }

        [HttpPost("doubts")]
        public async Task<IActionResult> CreateDoubt([FromBody] CreateDoubtRequest request)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var session = await _sessionService.CreateDoubtAsync(userId, request.Title, request.Description, request.Topic, request.Bounty);
                return Ok(new { message = "Doubt posted successfully", doubtId = session.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("accept/{id}")]
        public async Task<IActionResult> AcceptDoubt(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                await _sessionService.AcceptDoubtAsync(id, userId);
                return Ok(new { message = "Doubt accepted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("accept-request/{id}")]
        public async Task<IActionResult> AcceptSessionRequest(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                await _sessionService.AcceptSessionRequestAsync(id, userId);
                return Ok(new { message = "Session accepted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("reject-request/{id}")]
        public async Task<IActionResult> RejectSessionRequest(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                await _sessionService.RejectSessionRequestAsync(id, userId);
                return Ok(new { message = "Session rejected successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("book")]
        public async Task<IActionResult> BookSession([FromBody] BookSessionRequest request)
        {
            try
            {
                // Combine Date and Time in frontend or here. For now assuming StartTime is passed or calculated.
                // We need to update the service signature too.
                // For this step, I'll keep the service call simple but ideally we pass more data.
                // await _sessionService.BookSessionAsync(request.LearnerId, request.TutorId, request.Cost, request.Topic, request.StartTime);
                await _sessionService.BookSessionAsync(request.LearnerId, request.TutorId, request.Cost, request.Topic, request.StartTime); 
                // Note: Service update is needed for full functionality, but this connects the UI.
                return Ok(new { message = "Session booked successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("complete")]
        public async Task<IActionResult> CompleteSession([FromBody] CompleteSessionRequest request)
        {
            try
            {
                var tx = await _sessionService.CompleteSessionAsync(request.LearnerId, request.TutorId, request.Cost);
                return Ok(new { message = "Session completed successfully", transactionId = tx.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("rate")]
        public async Task<IActionResult> RateSession([FromBody] RateSessionRequest request)
        {
            try
            {
                await _sessionService.RateSessionAsync(request.TransactionId, request.SessionId, request.Rating, request.Comment);
                return Ok(new { message = "Session rated and feedback submitted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

    public class BookSessionRequest
    {
        public int LearnerId { get; set; }
        public int TutorId { get; set; }
        public decimal Cost { get; set; }
        public string Topic { get; set; }
        public DateTime StartTime { get; set; }
    }

    public class CompleteSessionRequest
    {
        public int LearnerId { get; set; }
        public int TutorId { get; set; }
        public decimal Cost { get; set; }
    }

    public class RateSessionRequest
    {
        public int TransactionId { get; set; }
        public int SessionId { get; set; }
        public double Rating { get; set; }
        public string Comment { get; set; }
    }

    public class CreateDoubtRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Topic { get; set; }
        public decimal Bounty { get; set; }
    }
}
