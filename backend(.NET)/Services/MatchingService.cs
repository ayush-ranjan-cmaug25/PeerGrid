using PeerGrid.Backend.Data;
using PeerGrid.Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PeerGrid.Backend.Services
{
    public class MatchingService
    {
        private readonly ApplicationDbContext _context;

        public MatchingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<User>> FindMatchesWithScoreAsync(string skillNeeded, int requesterId)
        {
            var requester = await _context.Users.FindAsync(requesterId);
            if (requester == null) return new List<User>();

            // Note: For complex JSON array querying, we might need specific EF Core functions.
            // For this prototype, we will fetch candidates and filter in memory to ensure correctness 
            // without debugging complex SQL translations.
            
            var allUsers = await _context.Users
                .Where(u => u.IsAvailable && u.Id != requesterId)
                .ToListAsync();

            var potentialMatches = allUsers
                .Where(u => u.SkillsOffered.Contains(skillNeeded))
                .ToList();

            // Sort by compatibility (overlapping skills)
            var sortedMatches = potentialMatches
                .Select(match => new
                {
                    User = match,
                    Score = match.SkillsNeeded.Intersect(requester.SkillsOffered).Count()
                })
                .OrderByDescending(x => x.Score)
                .Select(x => x.User)
                .ToList();

            return sortedMatches;
        }

        public async Task<List<User>> FindTriangularMatchAsync(int userId)
        {
            // User A
            var userA = await _context.Users.FindAsync(userId);
            if (userA == null) return new List<User>();

            var allUsers = await _context.Users.ToListAsync();

            // Find B: Users who need what A offers
            var potentialBs = allUsers
                .Where(u => u.SkillsNeeded.Intersect(userA.SkillsOffered).Any())
                .ToList();

            foreach (var userB in potentialBs)
            {
                if (userB.Id == userA.Id) continue;

                // Find C: Users who need what B offers AND offer what A needs
                var userC = allUsers.FirstOrDefault(u => 
                    u.SkillsNeeded.Intersect(userB.SkillsOffered).Any() &&
                    u.SkillsOffered.Intersect(userA.SkillsNeeded).Any() &&
                    u.Id != userA.Id &&
                    u.Id != userB.Id
                );

                if (userC != null)
                {
                    // Found a triangle: A -> B -> C -> A
                    return new List<User> { userA, userB, userC };
                }
            }

            return new List<User>(); // No triangle found
        }
    }
}
