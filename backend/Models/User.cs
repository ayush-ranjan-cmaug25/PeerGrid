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
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "User"; // Admin, User

        public List<string> SkillsOffered { get; set; } = new List<string>();
        public List<string> SkillsNeeded { get; set; } = new List<string>();

        public decimal GridPoints { get; set; } // Balance
        public decimal LockedPoints { get; set; } // Escrow
        
        public bool IsAvailable { get; set; } = true;
    }
}
