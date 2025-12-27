using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PeerGrid.Backend.Models
{
    public class Session
    {
        [Key]
        public int Id { get; set; }

        public int TutorId { get; set; }
        [ForeignKey("TutorId")]
        public User Tutor { get; set; }

        public int LearnerId { get; set; }
        [ForeignKey("LearnerId")]
        public User Learner { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Active, Completed, Cancelled
        public decimal Cost { get; set; }
    }
}
