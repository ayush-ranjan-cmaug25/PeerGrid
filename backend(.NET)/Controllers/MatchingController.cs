using Microsoft.AspNetCore.Mvc;
using PeerGrid.Backend.Models;
using PeerGrid.Backend.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PeerGrid.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchingController : ControllerBase
    {
        private readonly MatchingService _matchingService;

        public MatchingController(MatchingService matchingService)
        {
            _matchingService = matchingService;
        }

        [HttpGet("direct")]
        public async Task<ActionResult<List<User>>> FindMatches([FromQuery] string skillNeeded, [FromQuery] int requesterId)
        {
            var matches = await _matchingService.FindMatchesWithScoreAsync(skillNeeded, requesterId);
            return Ok(matches);
        }

        [HttpGet("triangular")]
        public async Task<ActionResult<List<User>>> FindTriangularMatch([FromQuery] int userId)
        {
            var match = await _matchingService.FindTriangularMatchAsync(userId);
            if (match == null || match.Count == 0)
            {
                return NotFound(new { message = "No triangular match found" });
            }
            return Ok(match);
        }
    }
}
