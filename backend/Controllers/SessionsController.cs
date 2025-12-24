using Microsoft.AspNetCore.Mvc;
using PeerGrid.Backend.Services;
using System;
using System.Threading.Tasks;

namespace PeerGrid.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionsController : ControllerBase
    {
        private readonly SessionService _sessionService;

        public SessionsController(SessionService sessionService)
        {
            _sessionService = sessionService;
        }

        [HttpPost("book")]
        public async Task<IActionResult> BookSession([FromBody] BookSessionRequest request)
        {
            try
            {
                await _sessionService.BookSessionAsync(request.LearnerId, request.TutorId, request.Cost);
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
                await _sessionService.CompleteSessionAsync(request.LearnerId, request.TutorId, request.Cost);
                return Ok(new { message = "Session completed successfully" });
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
                await _sessionService.RateSessionAsync(request.TransactionId, request.Rating);
                return Ok(new { message = "Session rated successfully" });
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
        public double Rating { get; set; }
    }
}
