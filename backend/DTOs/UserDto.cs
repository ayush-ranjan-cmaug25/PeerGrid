namespace PeerGrid.Backend.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public List<string> SkillsOffered { get; set; }
        public List<string> SkillsNeeded { get; set; }
        public decimal GridPoints { get; set; }
        public decimal LockedPoints { get; set; }
        public bool IsAvailable { get; set; }

        // Stats
        public double AverageRating { get; set; }
        public int TotalSessions { get; set; }
        public double HoursTaught { get; set; }
        public List<SessionDto> RecentSessions { get; set; }
        public List<string> Badges { get; set; }
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
