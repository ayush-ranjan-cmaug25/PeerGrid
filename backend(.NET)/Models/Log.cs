using System;

namespace PeerGrid.Backend.Models
{
    public class Log
    {
        public int Id { get; set; }
        public string Type { get; set; } // Security, User Action, System, Error, Admin
        public string Action { get; set; }
        public string User { get; set; } // User email or ID or "System"
        public string Details { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
