using PeerGrid.Backend.Data;
using PeerGrid.Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace PeerGrid.Backend.Services
{
    public class SessionService
    {
        private readonly ApplicationDbContext _context;

        public SessionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task BookSessionAsync(int learnerId, int tutorId, decimal cost)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var learner = await _context.Users.FindAsync(learnerId);
                if (learner == null) throw new Exception("Learner not found");
                if (learner.GridPoints < cost) throw new Exception("Insufficient funds");

                // Deduct from GridPoints and add to LockedPoints
                learner.GridPoints -= cost;
                learner.LockedPoints += cost;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task CompleteSessionAsync(int learnerId, int tutorId, decimal cost)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var learner = await _context.Users.FindAsync(learnerId);
                var tutor = await _context.Users.FindAsync(tutorId);

                if (learner == null || tutor == null) throw new Exception("User not found");

                // Move from Learner's LockedPoints to Tutor's GridPoints
                learner.LockedPoints -= cost;
                tutor.GridPoints += cost;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task RateSessionAsync(int transactionId, double rating)
        {
            var transactionRecord = await _context.Transactions.FindAsync(transactionId);
            if (transactionRecord == null) throw new Exception("Transaction not found");

            transactionRecord.Rating = rating;
            await _context.SaveChangesAsync();
        }

        public async Task<Session> CreateDoubtAsync(int learnerId, string title, string description, string topic, decimal bounty)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var learner = await _context.Users.FindAsync(learnerId);
                if (learner == null) throw new Exception("User not found");
                if (learner.GridPoints < bounty) throw new Exception("Insufficient funds");

                // Lock points
                learner.GridPoints -= bounty;
                learner.LockedPoints += bounty;

                // Create Session
                var session = new Session
                {
                    LearnerId = learnerId,
                    Title = title,
                    Description = description,
                    Topic = topic,
                    Cost = bounty,
                    Status = "Open",
                    StartTime = DateTime.UtcNow,
                    EndTime = DateTime.UtcNow.AddHours(1) // Default duration
                };

                _context.Sessions.Add(session);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return session;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task AcceptDoubtAsync(int sessionId, int tutorId)
        {
            var session = await _context.Sessions.FindAsync(sessionId);
            if (session == null) throw new Exception("Session not found");
            if (session.Status != "Open") throw new Exception("Doubt is no longer available");
            if (session.LearnerId == tutorId) throw new Exception("You cannot accept your own doubt");

            session.TutorId = tutorId;
            session.Status = "Active";
            session.StartTime = DateTime.UtcNow;
            session.EndTime = DateTime.UtcNow.AddHours(1);

            await _context.SaveChangesAsync();
        }
    }
}
