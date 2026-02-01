using System.Collections.Generic;

namespace PeerGrid.Backend.DTOs
{
    public class UpdateProfileRequest
    {
        public string Name { get; set; }
        public string Bio { get; set; }
        public string ProfilePictureUrl { get; set; }
        public List<string> SkillsOffered { get; set; } = new List<string>();
        public List<string> SkillsNeeded { get; set; } = new List<string>();
        
        // Optional password update
        public string? Password { get; set; }
    }
}
