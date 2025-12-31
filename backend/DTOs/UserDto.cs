namespace PeerGrid.Backend.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string Bio { get; set; }
        public string ProfilePictureUrl { get; set; }
        public List<string> SkillsOffered { get; set; } = new();
        public List<string> SkillsNeeded { get; set; } = new();
        public decimal GridPoints { get; set; }
        public decimal LockedPoints { get; set; }
        public bool IsAvailable { get; set; }

        // Stats
        public double AverageRating { get; set; }
        public int TotalSessions { get; set; }
        public double HoursTaught { get; set; }
        public List<SessionDto> RecentSessions { get; set; } = new();
        public List<string> Badges { get; set; } = new();
    }

    public class SessionDto
    {
        public int Id { get; set; }
        public string Topic { get; set; }
        public string OtherParty { get; set; }
        public DateTime Time { get; set; }
        public string Status { get; set; }
    }
}
