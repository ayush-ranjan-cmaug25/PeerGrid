using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace PeerGrid.Backend.Models
{
    public class Webinar
    {
        [Key]
        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public int HostId { get; set; }
        
        [ForeignKey("HostId")]
        public virtual User Host { get; set; }

        public DateTime ScheduledTime { get; set; }
        
        public int DurationMinutes { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Cost { get; set; }
        
        public string MeetingLink { get; set; }

        // Store registered user IDs as a comma-separated string or utilize a join table.
        // For simplicity and matching Java's @ElementCollection equivalent without a join table entity:
        // We can use a property that maps to a join table, but EF Core requires a Join Entity for explicit many-to-many 
        // OR we can let EF Core handle it. 
        // Let's create a Join Entity for better control actually, or just use a List<User> if EF Core 5+ (it is likely .NET 6/7/8).
        
        public virtual ICollection<User> RegisteredUsers { get; set; } = new List<User>();
    }
}
