using PeerGrid.Backend.Models;
using Microsoft.EntityFrameworkCore;
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
            context.Database.Migrate();

            // Check if DB has been seeded with the new admin
            if (context.Users.Any(u => u.Email == "admin@peergrid.com"))
            {
                return;
            }

            // 1. Users
            var users = new List<User>
            {
                new User { Name = "Ayush Admin", Email = "admin@peergrid.com", PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes("admin123")), Role = "Admin", GridPoints = 5000, Bio = "System Administrator" },
                new User { Name = "John Doe", Email = "user@peergrid.com", PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes("user123")), Role = "User", GridPoints = 150, Bio = "Aspiring Full Stack Developer", SkillsOffered = new List<string>{"HTML", "CSS"}, SkillsNeeded = new List<string>{"React", "Node.js"} },
                new User { Name = "Alice Chen", Email = "alice@peergrid.com", PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes("password")), Role = "User", GridPoints = 1200, Bio = "Senior React Developer loving to teach.", SkillsOffered = new List<string>{"React", "JavaScript", "Redux"}, SkillsNeeded = new List<string>{"Python", "Machine Learning"} },
                new User { Name = "Bob Smith", Email = "bob@peergrid.com", PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes("password")), Role = "User", GridPoints = 800, Bio = "Backend Wizard. C# & .NET Core enthusiast.", SkillsOffered = new List<string>{"C#", ".NET", "SQL"}, SkillsNeeded = new List<string>{"Angular", "Design"} },
                new User { Name = "Charlie Kim", Email = "charlie@peergrid.com", PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes("password")), Role = "User", GridPoints = 50, Bio = "Student learning Python.", SkillsOffered = new List<string>{"Mathematics"}, SkillsNeeded = new List<string>{"Python", "Data Science"} },
                new User { Name = "Diana Prince", Email = "diana@peergrid.com", PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes("password")), Role = "User", GridPoints = 3000, Bio = "UX/UI Designer and Frontend Dev.", SkillsOffered = new List<string>{"Figma", "UI/UX", "CSS"}, SkillsNeeded = new List<string>{"Backend", "API Design"} }
            };

            foreach (var user in users)
            {
                if (!context.Users.Any(u => u.Email == user.Email))
                {
                    context.Users.Add(user);
                }
            }
            context.SaveChanges();

            // Retrieve users for linking
            var admin = context.Users.First(u => u.Email == "admin@peergrid.com");
            var john = context.Users.First(u => u.Email == "user@peergrid.com");
            var alice = context.Users.First(u => u.Email == "alice@peergrid.com");
            var bob = context.Users.First(u => u.Email == "bob@peergrid.com");
            var charlie = context.Users.First(u => u.Email == "charlie@peergrid.com");
            var diana = context.Users.First(u => u.Email == "diana@peergrid.com");

            // 2. Messages
            var messages = new Message[]
            {
                new Message { SenderId = alice.Id, ReceiverId = john.Id, Content = "Hey John! I saw you needed help with React.", Timestamp = DateTime.UtcNow.AddDays(-2) },
                new Message { SenderId = john.Id, ReceiverId = alice.Id, Content = "Hi Alice! Yes, I'm struggling with useEffect.", Timestamp = DateTime.UtcNow.AddDays(-2).AddMinutes(5) },
                new Message { SenderId = alice.Id, ReceiverId = john.Id, Content = "No worries, it's tricky at first. Check out the doubt board, I can pick up your query there.", Timestamp = DateTime.UtcNow.AddDays(-2).AddMinutes(10) },
                
                new Message { SenderId = bob.Id, ReceiverId = john.Id, Content = "Welcome to PeerGrid!", Timestamp = DateTime.UtcNow.AddDays(-5) },
                
                new Message { SenderId = charlie.Id, ReceiverId = diana.Id, Content = "Love your design work on the new project!", Timestamp = DateTime.UtcNow.AddHours(-1) }
            };
            context.Messages.AddRange(messages);

            // 3. Sessions (Doubts, Upcoming, Past)
            var sessions = new Session[]
            {
                // --- Open Doubts (For Doubt Board) ---
                new Session { LearnerId = john.Id, Topic = "React", Title = "Infinite Loop in useEffect", Description = "My component keeps re-rendering and making API calls infinitely. Need help understanding dependency arrays.", Status = "Open", Cost = 50, StartTime = DateTime.UtcNow, EndTime = DateTime.UtcNow.AddHours(1) },
                new Session { LearnerId = charlie.Id, Topic = "Python", Title = "Pandas DataFrame Merge", Description = "How do I do a left join on two dataframes with different column names?", Status = "Open", Cost = 30, StartTime = DateTime.UtcNow, EndTime = DateTime.UtcNow.AddHours(1) },
                new Session { LearnerId = diana.Id, Topic = "Backend", Title = "REST API Authentication", Description = "Best practices for storing JWT tokens securely on the frontend?", Status = "Open", Cost = 100, StartTime = DateTime.UtcNow, EndTime = DateTime.UtcNow.AddHours(1) },
                new Session { LearnerId = john.Id, Topic = "Node.js", Title = "Express Middleware Error", Description = "Error handling middleware is not catching async errors.", Status = "Open", Cost = 40, StartTime = DateTime.UtcNow, EndTime = DateTime.UtcNow.AddHours(1) },

                // --- Upcoming Sessions (For Dashboard) ---
                new Session { TutorId = alice.Id, LearnerId = john.Id, Topic = "React", Title = "Advanced Hooks Patterns", Description = "Deep dive into useReducer and custom hooks.", Status = "Confirmed", Cost = 80, StartTime = DateTime.UtcNow.AddDays(1).AddHours(10), EndTime = DateTime.UtcNow.AddDays(1).AddHours(11) },
                new Session { TutorId = bob.Id, LearnerId = charlie.Id, Topic = "C#", Title = "LINQ Queries", Description = "Optimizing database queries with LINQ.", Status = "Confirmed", Cost = 60, StartTime = DateTime.UtcNow.AddDays(2).AddHours(14), EndTime = DateTime.UtcNow.AddDays(2).AddHours(15) },

                // --- Past/Completed Sessions (For History) ---
                new Session { TutorId = bob.Id, LearnerId = john.Id, Topic = "C#", Title = "Intro to .NET Core", Description = "Setting up the environment and first API.", Status = "Completed", Cost = 50, StartTime = DateTime.UtcNow.AddDays(-3), EndTime = DateTime.UtcNow.AddDays(-3).AddHours(1) },
                new Session { TutorId = diana.Id, LearnerId = alice.Id, Topic = "Design", Title = "Figma Auto-Layout", Description = "Mastering responsive design in Figma.", Status = "Completed", Cost = 70, StartTime = DateTime.UtcNow.AddDays(-10), EndTime = DateTime.UtcNow.AddDays(-10).AddHours(1) }
            };
            context.Sessions.AddRange(sessions);

            // 4. Transactions (For Wallet/Points History)
            var transactions = new Transaction[]
            {
                new Transaction { LearnerId = john.Id, TutorId = bob.Id, Skill = "C# Intro", Points = 50, Timestamp = DateTime.UtcNow.AddDays(-3), Rating = 5 },
                new Transaction { LearnerId = alice.Id, TutorId = diana.Id, Skill = "Figma Help", Points = 70, Timestamp = DateTime.UtcNow.AddDays(-10), Rating = 4.8 },
                new Transaction { LearnerId = charlie.Id, TutorId = bob.Id, Skill = "SQL Basics", Points = 30, Timestamp = DateTime.UtcNow.AddDays(-15), Rating = 4.5 }
            };
            context.Transactions.AddRange(transactions);

            context.SaveChanges();
        }
    }
}
