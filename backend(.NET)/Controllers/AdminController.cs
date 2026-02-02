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
            return await _context.Users.Where(u => u.Role != "Admin").ToListAsync();
        }

        // POST: api/Admin/users
        [HttpPost("users")]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                return BadRequest("Email already exists");
            }

            if (!string.IsNullOrEmpty(user.PasswordHash))
            {
                user.PasswordHash = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(user.PasswordHash));
            }
            else
            {
                 // Default password if not provided? Or require it.
                 user.PasswordHash = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes("DefaultPass123!"));
            }

            user.GridPoints = 100; // Default
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            await LogAction("Admin", "User Created", User.Identity?.Name ?? "Admin", $"Created user: {user.Email}");

            return CreatedAtAction(nameof(GetAllUsers), new { id = user.Id }, user);
        }

        // DELETE: api/Admin/users/5
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            // 1. Get Sessions
            var tutorSessions = await _context.Sessions.Where(s => s.TutorId == id).ToListAsync();
            var learnerSessions = await _context.Sessions.Where(s => s.LearnerId == id).ToListAsync();
            var allSessions = tutorSessions.Concat(learnerSessions).Distinct().ToList();

            // 2. Delete Feedbacks for these sessions
            foreach (var session in allSessions)
            {
                var feedbacks = await _context.Feedbacks.Where(f => f.SessionId == session.Id).ToListAsync();
                _context.Feedbacks.RemoveRange(feedbacks);
            }

            // 3. Delete Sessions
            _context.Sessions.RemoveRange(allSessions);

            // 4. Delete Transactions
            var transactions = await _context.Transactions
                                    .Where(t => t.LearnerId == id || t.TutorId == id)
                                    .ToListAsync();
            _context.Transactions.RemoveRange(transactions);

            // 5. Delete User
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            await LogAction("Admin", "User Deleted", User.Identity?.Name ?? "Admin", $"Deleted user ID: {id}");

            return Ok(new { message = "User deleted successfully" });
        }

        // POST: api/Admin/seed-sessions
        [HttpPost("seed-sessions")]
        public async Task<IActionResult> SeedSessions()
        {
            var users = await _context.Users.ToListAsync();
            if (users.Count < 2) return BadRequest("Not enough users to seed sessions.");

            var random = new Random();
            var sessions = new List<Session>();
            var statuses = new[] { "Completed", "Active", "Confirmed", "Pending", "Cancelled" };
            var topics = new[] { "React Hook Form", "ASP.NET Core Auth", "Docker Networking", "Kubernetes Pods", "SQL Indexing", "CSS Grid", "TypeScript Generics" };

            // Create 30 random sessions
            for (int i = 0; i < 30; i++)
            {
                var learner = users[random.Next(users.Count)];
                User tutor = null;
                int? tutorId = null;

                // 20% chance of being an Open doubt
                bool isOpen = random.NextDouble() < 0.2;
                string status;

                if (isOpen)
                {
                    status = "Open";
                }
                else
                {
                   status = statuses[random.Next(statuses.Length)];
                   tutor = users[random.Next(users.Count)];
                   while (tutor.Id == learner.Id)
                   {
                       tutor = users[random.Next(users.Count)];
                   }
                   tutorId = tutor.Id;
                }

                var startTime = DateTime.UtcNow.AddDays(random.Next(-10, 10));

                sessions.Add(new Session
                {
                    LearnerId = learner.Id,
                    TutorId = tutorId,
                    Topic = topics[random.Next(topics.Length)],
                    Title = isOpen ? $"Help needed with {topics[random.Next(topics.Length)]}" : $"Session {i + 1}",
                    Description = "Seeded session for testing overview.",
                    Status = status,
                    StartTime = startTime,
                    EndTime = startTime.AddHours(1),
                    Cost = random.Next(10, 100)
                });
            }
            
            _context.Sessions.AddRange(sessions);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Seeded {sessions.Count} sessions." });
        }

        // PUT: api/Admin/users/{id}/status
        [HttpPut("users/{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(int id, [FromBody] Dictionary<string, string> body)
        {
            if (!body.ContainsKey("status")) return BadRequest("Status is required");
            string status = body["status"];

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            if (status.Equals("Banned", StringComparison.OrdinalIgnoreCase))
            {
                user.Banned = true;
            }
            else if (status.Equals("Active", StringComparison.OrdinalIgnoreCase))
            {
                user.Banned = false;
            }

            await _context.SaveChangesAsync();
            await LogAction("Admin", "User Status Updated", User.Identity?.Name ?? "Admin", $"Updated status of user ID: {id} to {status}");

            return Ok(new { message = "User status updated successfully", banned = user.Banned });
        }

        // PUT: api/Admin/users/5
        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            if (id != user.Id) return BadRequest();

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null) return NotFound();

            existingUser.Role = user.Role;
            // Update other fields as needed

            await _context.SaveChangesAsync();
            
            await LogAction("Admin", "User Updated", User.Identity?.Name ?? "Admin", $"Updated role for user ID: {id} to {user.Role}");

            return Ok(new { message = "User updated successfully" });
        }

        // GET: api/Admin/sessions
        [HttpGet("sessions")]
        public async Task<ActionResult<IEnumerable<Session>>> GetAllSessions()
        {
            return await _context.Sessions.Include(s => s.Tutor).Include(s => s.Learner).ToListAsync();
        }
        // GET: api/Admin/stats
        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetStats()
        {
            var totalUsers = await _context.Users.CountAsync();
            var activeSessions = await _context.Sessions.CountAsync(s => s.Status == "Active");
            var activeBounties = await _context.Sessions.CountAsync(s => s.TutorId == null && s.Status == "Open");
            var pendingReports = 0; // Placeholder

            // Calculate Sessions History (Last 7 Days)
            var sessionHistory = new List<object>();
            var today = DateTime.UtcNow.Date;
            
            for (int i = 6; i >= 0; i--)
            {
                var date = today.AddDays(-i);
                var label = date.DayOfWeek.ToString().Substring(0, 3); // Mon, Tue...
                
                // Count sessions that started on this date
                var count = await _context.Sessions
                    .CountAsync(s => s.StartTime.Date == date);
                
                sessionHistory.Add(new { label, value = count });
            }

            return new
            {
                totalUsers,
                activeSessions,
                activeBounties,
                pendingReports,
                sessionsHistory = sessionHistory
            };
        }

        // GET: api/Admin/bounties
        [HttpGet("bounties")]
        public async Task<ActionResult<IEnumerable<Session>>> GetBounties()
        {
            return await _context.Sessions
                .Where(s => s.TutorId == null)
                .Include(s => s.Learner)
                .ToListAsync();
        }

        // GET: api/Admin/skills
        [HttpGet("skills")]
        public async Task<ActionResult<IEnumerable<object>>> GetSkills()
        {
            var users = await _context.Users.ToListAsync();
            var allSkills = users.SelectMany(u => u.SkillsOffered)
                                 .GroupBy(s => s)
                                 .Select(g => new { Label = g.Key, Value = g.Count() })
                                 .OrderByDescending(x => x.Value)
                                 .Take(5)
                                 .ToList();
            return allSkills;
        }

        // DELETE: api/Admin/sessions/{id}
        [HttpDelete("sessions/{id}")]
        public async Task<IActionResult> DeleteSession(int id)
        {
            var session = await _context.Sessions.FindAsync(id);
            if (session == null) return NotFound();

            // Return funds if it was an open doubt/bounty
            if (session.TutorId == null && session.Status == "Open")
            {
                 var learner = await _context.Users.FindAsync(session.LearnerId);
                 if (learner != null)
                 {
                     learner.LockedPoints -= session.Cost;
                     learner.GridPoints += session.Cost;
                 }
            }

            _context.Sessions.Remove(session);
            await _context.SaveChangesAsync();
            await LogAction("Admin", "Session/Bounty Deleted", User.Identity?.Name ?? "Admin", $"Deleted session ID: {id}");
            return Ok(new { message = "Session deleted successfully" });
        }

        // PUT: api/Admin/sessions/{id}/status
        [HttpPut("sessions/{id}/status")]
        public async Task<IActionResult> UpdateSessionStatus(int id, [FromBody] Dictionary<string, string> body)
        {
            if (!body.ContainsKey("status")) return BadRequest("Status is required");
            string status = body["status"];

            var session = await _context.Sessions.FindAsync(id);
            if (session == null) return NotFound();

            // Handle refund if closing an open bounty
            if (session.Status == "Open" && status == "Closed" && session.TutorId == null)
            {
                 var learner = await _context.Users.FindAsync(session.LearnerId);
                 if (learner != null)
                 {
                     learner.LockedPoints -= session.Cost;
                     learner.GridPoints += session.Cost;
                 }
            }
            // Handle re-opening (deduct funds again if they were refunded? Complex. For now, assume admin overrides funds manually if needed or just re-opens)
            // Ideally re-opening should arguably check funds again. For simplicity in this admin override, we just change status.

            session.Status = status;
            await _context.SaveChangesAsync();
            await LogAction("Admin", "Session Status Updated", User.Identity?.Name ?? "Admin", $"Updated status of session {id} to {status}");
            return Ok(new { message = "Session status updated successfully" });
        }

        // GET: api/Admin/transactions
        [HttpGet("transactions")]
        public async Task<ActionResult<IEnumerable<object>>> GetTransactions()
        {
            // Group by week or day is complex in EF Core SQL translation sometimes, 
            // so we'll fetch recent transactions and process in memory for this demo or return raw.
            // Returning raw recent transactions for the frontend to process or simple aggregation.
            
            // For the chart, we need volume over time.
            var transactions = await _context.Transactions
                .OrderByDescending(t => t.Timestamp)
                .Take(100)
                .ToListAsync();

            return transactions;
        }

        // PUT: api/Admin/users/{id}/gp
        [HttpPut("users/{id}/gp")]
        public async Task<IActionResult> AdjustUserGP(int id, [FromBody] decimal amount)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            user.GridPoints += amount;
            await _context.SaveChangesAsync();

            string action = amount >= 0 ? "GP Added" : "GP Removed";
            await LogAction("Admin", action, User.Identity?.Name ?? "Admin", $"Adjusted GP for user ID: {id} by {amount}");

            return Ok(new { message = "User GP updated successfully", newBalance = user.GridPoints });
        }
        // GET: api/Admin/feedbacks
        [HttpGet("feedbacks")]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedbacks()
        {
            return await _context.Feedbacks
                .Include(f => f.Session)
                .ThenInclude(s => s.Tutor)
                .Include(f => f.Session)
                .ThenInclude(s => s.Learner)
                .ToListAsync();
        }

        // GET: api/Admin/logs
        [HttpGet("logs")]
        public async Task<ActionResult<IEnumerable<Log>>> GetLogs()
        {
            if (!await _context.Logs.AnyAsync())
            {
                // Seed dummy data
                var dummyLogs = new List<Log>();
                // Fetch actual users from DB
                var dbUsers = await _context.Users.Select(u => u.Email).ToListAsync();
                if (!dbUsers.Any()) dbUsers.Add("System");

                var random = new Random();

                for (int i = 0; i < 50; i++)
                {
                    string type;
                    string action;
                    string details;
                    
                    int typeChoice = i % 6;
                    switch (typeChoice)
                    {
                        case 0:
                            type = "Security";
                            action = new[] { "Login Attempt", "Password Changed", "New Registration" }[random.Next(3)];
                            if (action == "Login Attempt") details = $"Failed login attempt from IP: 192.168.1.{random.Next(1, 255)}";
                            else if (action == "Password Changed") details = "User changed password successfully.";
                            else details = "New user registered with email verification pending.";
                            break;
                        case 1:
                            type = "User Action";
                            action = new[] { "Session Created", "Profile Updated" }[random.Next(2)];
                            if (action == "Session Created") details = $"Created session 'Introduction to React' with tutor ID: {random.Next(100, 999)}";
                            else details = "Updated bio and skills.";
                            break;
                        case 2:
                            type = "System";
                            action = new[] { "Backup Completed", "System Maintenance" }[random.Next(2)];
                            if (action == "Backup Completed") details = $"Daily database backup completed successfully. Size: {random.Next(50, 500)}MB";
                            else details = $"Scheduled maintenance executed. Duration: {random.Next(100, 5000)}ms";
                            break;
                        case 3:
                            type = "Admin";
                            action = new[] { "User Banned", "GP Added", "GP Removed" }[random.Next(3)];
                            if (action == "User Banned") details = "Banned user for violation of terms.";
                            else if (action == "GP Added") details = $"Admin added {random.Next(10, 500)} GP to user account.";
                            else details = $"Admin removed {random.Next(10, 500)} GP from user account.";
                            break;
                        case 4:
                            type = "Error";
                            action = new[] { "Payment Timeout", "Database Connection Failed" }[random.Next(2)];
                            if (action == "Payment Timeout") details = $"Gateway timeout during transaction ID: TXN-{random.Next(10000, 99999)}";
                            else details = "Connection pool exhausted. Retrying...";
                            break;
                        case 5:
                            type = "Finance";
                            action = "Payment Success";
                            details = $"Payment of {random.Next(100, 5000)} INR successful. Order ID: ORD-{random.Next(10000, 99999)}";
                            break;
                        default:
                            type = "System";
                            action = "Unknown";
                            details = "Unknown system event.";
                            break;
                    }

                    dummyLogs.Add(new Log
                    {
                        Type = type,
                        Action = action,
                        User = dbUsers[random.Next(dbUsers.Count)],
                        Details = details,
                        Timestamp = DateTime.UtcNow.AddHours(-i * 2)
                    });
                }
                
                _context.Logs.AddRange(dummyLogs);
                await _context.SaveChangesAsync();
            }

            return await _context.Logs
                .OrderByDescending(l => l.Timestamp)
                .Take(100)
                .ToListAsync();
        }

        private async Task LogAction(string type, string action, string user, string details)
        {
            var log = new Log
            {
                Type = type,
                Action = action,
                User = user,
                Details = details,
                Timestamp = DateTime.UtcNow
            };
            _context.Logs.Add(log);
            await _context.SaveChangesAsync();
        }
    }
}
