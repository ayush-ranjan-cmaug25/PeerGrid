using PeerGrid.Backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PeerGrid.Backend.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            // Look for any users.
            if (context.Users.Any())
            {
                return;   // DB has been seeded
            }

            var users = new User[]
            {
                new User { Name = "Ayush", Email = "ayush@admin.com", PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes("password")), Role = "Admin", GridPoints = 1000 },
                new User { Name = "Alice Peer", Email = "alice@peergrid.com", PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes("password")), Role = "User", GridPoints = 100, SkillsOffered = new List<string>{"Python", "Java"}, SkillsNeeded = new List<string>{"React"} },
                new User { Name = "Bob Peer", Email = "bob@peergrid.com", PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes("password")), Role = "User", GridPoints = 500, SkillsOffered = new List<string>{"React", "C#"}, SkillsNeeded = new List<string>{"Design"} },
                new User { Name = "Charlie Peer", Email = "charlie@peergrid.com", PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes("password")), Role = "User", GridPoints = 50 }
            };

            foreach (var u in users)
            {
                context.Users.Add(u);
            }
            context.SaveChanges();

            // Add some messages
            var admin = context.Users.First(u => u.Email == "ayush@admin.com");
            var alice = context.Users.First(u => u.Email == "alice@peergrid.com");
            var bob = context.Users.First(u => u.Email == "bob@peergrid.com");
            var charlie = context.Users.First(u => u.Email == "charlie@peergrid.com");

            var messages = new Message[]
            {
                new Message { SenderId = alice.Id, ReceiverId = bob.Id, Content = "Hi Bob, can you help me with React?", Timestamp = DateTime.UtcNow.AddHours(-2) },
                new Message { SenderId = bob.Id, ReceiverId = alice.Id, Content = "Sure Alice! What's the issue?", Timestamp = DateTime.UtcNow.AddHours(-1.9) },
                new Message { SenderId = alice.Id, ReceiverId = bob.Id, Content = "I'm stuck on useEffect hooks.", Timestamp = DateTime.UtcNow.AddHours(-1.8) },
                new Message { SenderId = bob.Id, ReceiverId = alice.Id, Content = "No problem. Let's schedule a session.", Timestamp = DateTime.UtcNow.AddHours(-1.7) },
                
                new Message { SenderId = admin.Id, ReceiverId = alice.Id, Content = "Welcome to PeerGrid, Alice!", Timestamp = DateTime.UtcNow.AddDays(-1) }
            };

            foreach (var m in messages)
            {
                context.Messages.Add(m);
            }

            var sessions = new Session[]
            {
                // Upcoming Session
                new Session { TutorId = bob.Id, LearnerId = alice.Id, Topic = "React Hooks", Title = "Mastering useEffect", Description = "Deep dive into hooks", StartTime = DateTime.UtcNow.AddHours(24), EndTime = DateTime.UtcNow.AddHours(25), Status = "Confirmed", Cost = 50 },
                
                // Past Session
                new Session { TutorId = bob.Id, LearnerId = alice.Id, Topic = "JavaScript Basics", Title = "JS Fundamentals", Description = "ES6 features", StartTime = DateTime.UtcNow.AddDays(-2), EndTime = DateTime.UtcNow.AddDays(-2).AddHours(1), Status = "Completed", Cost = 40 },

                // Doubts (Open Sessions)
                new Session { LearnerId = alice.Id, Topic = "Calculus", Title = "Derivatives Help", Description = "Need help with chain rule problems.", Status = "Open", Cost = 30 },
                new Session { LearnerId = charlie.Id, Topic = "CSS Grid", Title = "Layout Issues", Description = "Grid items not aligning properly.", Status = "Open", Cost = 20 }
            };

            foreach (var s in sessions)
            {
                context.Sessions.Add(s);
            }

            var transactions = new Transaction[]
            {
                new Transaction { LearnerId = alice.Id, TutorId = bob.Id, Skill = "React Help", Points = 50, Timestamp = DateTime.UtcNow.AddDays(-5), Rating = 5 },
                new Transaction { LearnerId = charlie.Id, TutorId = alice.Id, Skill = "Python Basics", Points = 30, Timestamp = DateTime.UtcNow.AddDays(-3), Rating = 4.5 },
                new Transaction { LearnerId = alice.Id, TutorId = charlie.Id, Skill = "CSS Styling", Points = 20, Timestamp = DateTime.UtcNow.AddDays(-1), Rating = 5 }
            };

            foreach (var t in transactions)
            {
                context.Transactions.Add(t);
            }

            context.SaveChanges();
        }
    }
}
