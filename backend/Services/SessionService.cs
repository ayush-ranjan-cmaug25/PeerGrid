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
    }
}
