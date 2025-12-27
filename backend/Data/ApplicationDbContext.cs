using Microsoft.EntityFrameworkCore;
using PeerGrid.Backend.Models;
using System.Collections.Generic;
using System.Linq;

namespace PeerGrid.Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        
        public ApplicationDbContext() { }

        public DbSet<User> Users { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=PeerGridDb;Trusted_Connection=True;MultipleActiveResultSets=true");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Convert List<string> to comma-separated string for SQLite
            modelBuilder.Entity<User>()
                .Property(u => u.SkillsOffered)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());

            modelBuilder.Entity<User>()
                .Property(u => u.SkillsNeeded)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());

            // Fix for multiple cascade paths in SQL Server
            modelBuilder.Entity<Session>()
                .HasOne(s => s.Tutor)
                .WithMany()
                .HasForeignKey(s => s.TutorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Session>()
                .HasOne(s => s.Learner)
                .WithMany()
                .HasForeignKey(s => s.LearnerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
