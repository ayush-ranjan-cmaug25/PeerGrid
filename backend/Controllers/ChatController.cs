using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using PeerGrid.Backend.Data;
using PeerGrid.Backend.Hubs;
using PeerGrid.Backend.Models;
using System.Security.Claims;

namespace PeerGrid.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatController(ApplicationDbContext context, IHubContext<ChatHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // GET: api/chat/conversations
        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            // Get all messages where user is sender or receiver
            var messages = await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                .OrderByDescending(m => m.Timestamp)
                .ToListAsync();

            // Group by the other user
            var conversations = messages
                .GroupBy(m => m.SenderId == userId ? m.ReceiverId : m.SenderId)
                .Select(g => {
                    var otherUser = g.First().SenderId == userId ? g.First().Receiver : g.First().Sender;
                    var lastMsg = g.First(); // Already ordered by desc
                    return new
                    {
                        Id = otherUser.Id,
                        Name = otherUser.Name,
                        Avatar = string.Join("", otherUser.Name.Split(' ').Select(n => n[0])), // Initials
                        LastMessage = lastMsg.Content,
                        Time = lastMsg.Timestamp.ToLocalTime().ToString("t"), // Short time format
                        Online = false // Placeholder
                    };
                })
                .ToList();

            return Ok(conversations);
        }

        // GET: api/chat/messages/{otherUserId}
        [HttpGet("messages/{otherUserId}")]
        public async Task<IActionResult> GetMessages(int otherUserId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var messages = await _context.Messages
                .Where(m => (m.SenderId == userId && m.ReceiverId == otherUserId) ||
                            (m.SenderId == otherUserId && m.ReceiverId == userId))
                .OrderBy(m => m.Timestamp)
                .Select(m => new
                {
                    Id = m.Id,
                    Sender = m.SenderId == userId ? "me" : "them",
                    Text = m.Content,
                    Time = m.Timestamp.ToLocalTime().ToString("t")
                })
                .ToListAsync();

            return Ok(messages);
        }

        // POST: api/chat/send
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var message = new Message
            {
                SenderId = userId,
                ReceiverId = request.ReceiverId,
                Content = request.Content,
                Timestamp = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // Notify receiver via SignalR
            await _hubContext.Clients.Group($"User_{request.ReceiverId}").SendAsync("ReceiveMessage", new 
            {
                Id = message.Id,
                Sender = "them",
                Text = message.Content,
                Time = message.Timestamp.ToLocalTime().ToString("t"),
                SenderId = userId
            });

            return Ok(new { 
                Id = message.Id, 
                Sender = "me", 
                Text = message.Content, 
                Time = message.Timestamp.ToLocalTime().ToString("t") 
            });
        }
    }

    public class SendMessageRequest
    {
        public int ReceiverId { get; set; }
        public string Content { get; set; }
    }
}
