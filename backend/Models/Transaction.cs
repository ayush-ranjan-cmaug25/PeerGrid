using System;
using System.ComponentModel.DataAnnotations;

namespace PeerGrid.Backend.Models
{
    public class Transaction
    {
        [Key]
        public int Id { get; set; }

        public int LearnerId { get; set; }
        public int TutorId { get; set; }
        public string Skill { get; set; } = string.Empty;
        public decimal Points { get; set; }
        public DateTime Timestamp { get; set; }

        public double? Rating { get; set; } // 1-5 stars
    }
}
