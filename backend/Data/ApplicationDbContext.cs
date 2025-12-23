using Microsoft.EntityFrameworkCore;
using PeerGrid.Backend.Models;

namespace PeerGrid.Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        
        public ApplicationDbContext() { }

        public DbSet<User> Users { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var connectionString = "server=localhost;database=peergrid;user=root;password=cdac";
                optionsBuilder.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 43)));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure List<string> to be stored as JSON
            modelBuilder.Entity<User>()
                .Property(u => u.SkillsOffered)
                .HasColumnType("json");

            modelBuilder.Entity<User>()
                .Property(u => u.SkillsNeeded)
                .HasColumnType("json");
        }
    }
}
