using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PeerGrid.Backend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // Storing lists as simple strings for this prototype (comma separated) or could be separate tables.
        // For simplicity in this prototype, we'll serialize them or use a simple string wrapper, 
        // but to keep it relational, let's just use a simple string for now or ignore complex relationships for the "prototype" speed.
        // Actually, let's use a simple approach: JSON column or just string for the prototype.
        // EF Core 8 supports primitive collections, let's try to use that if possible, or fallback to string.
        // MySQL with Pomelo supports JSON columns. Let's stick to simple List<string> and configure it in OnModelCreating if needed, 
        // but for a "Human-Readable" prototype, let's just make them strings for now to avoid complex EF configurations.
        
        public List<string> SkillsOffered { get; set; } = new List<string>();
        public List<string> SkillsNeeded { get; set; } = new List<string>();

        public decimal GridPoints { get; set; } // Balance
        public decimal LockedPoints { get; set; } // Escrow
        
        // For Verified Endorsements
        public bool IsVerifiedTutor { get; set; }

        public bool IsAvailable { get; set; } = true;
    }
}
