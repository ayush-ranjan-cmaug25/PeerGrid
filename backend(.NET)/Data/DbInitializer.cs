using PeerGrid.Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PeerGrid.Backend.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            context.Database.Migrate();

            var random = new Random();

            // 1. Ensure Users Exist
            if (!context.Users.Any())
            {
                var names = new string[]
                {
                    "Aakash Kharade", "Aasif Jamal", "Abhishek Borse", "Abhishek Dasondhi", "Abhishek Jagtap", "Abhishek Gaikwad",
                    "Adarsh Chandel", "Adarsh Kushwah", "Aditya Adhikari", "Aditya Korde", "Afsha Khan", "Ajay Patil",
                    "Akanksha Puri", "Akanksha Dhanawade", "Akash Kokulwar", "Akash Bhadane", "Akshay Balte", "Amar Toge",
                    "Amarnath Malpuri", "Amey Parab", "Amey Raut", "Aniket Sherkar", "Aniket Darade", "Anirudha Shinde",
                    "Ankita Kanthe", "Ankita Kher", "Annu Yadav", "Anuj Trivedi", "Anurag More", "Anushka Chavan", "Apurva Dhonde",
                    "Aryan Gawade", "Aryan Pate", "Aryan Shambharkar", "Asfiya Shaikh", "Asmit Upganlawar", "Asmita Mhetre",
                    "Atharva Thumbare", "Avneesh Dubey", "Ayush Ranjan", "Bhagyesh Wani", "Bhavna Balpande", "Bhushan Dhavan",
                    "Bhushan Attarde", "Bhushan Thate", "Chaitali Barhate", "Chetankumar Banjara", "Chinmay Bonde", "Darshan Gadakh",
                    "Darshana Malewar", "Deepa Jadhav", "Deepra Banerjee", "Devendra Deore", "Dhananjay Shitole", "Dhanashree Pawar",
                    "Dhaval Patil", "Dhiraj Patil", "Digvijay Thanekar", "Dipak Firake", "Dipali Vasave", "Dipti Akhade",
                    "Dnyaneshvar Suryavanshi", "Fameshwari", "Gaurav Patil", "Gaurav Sontakke", "Gaurav Apte", "Gaurav Mishra",
                    "Gaurav Salunkhe", "Gauri Kolte", "Goutam Soni", "Gunjan Chaudhari", "Hanuman Jadhav", "Harshal Tarmale",
                    "Heramb Shinde", "Himanshu Patil", "Himanshu Samrit", "Hitesh Chaudhari", "Hrishikesh Tappe", "Isha Puranik",
                    "Isha Gulhane", "Ishan Raizada", "Jaydeep Patidar", "Kalyanee Pachghare", "Kamlini Bhasme", "Kapil Katte",
                    "Kaushal Patil", "Khetesh Choudhary", "Kiran Mahajan", "Komal Kadnor", "Komal Jadhav", "Krishna Chikkala",
                    "Krushna Chavan", "Madhuri Chavan", "Manali Bhujbal", "Manish Chaudhari", "Mickey Manohar", "Minal Kamde",
                    "Mohammad Ansari", "Mohammad Mulla", "Mohd Allahuddin", "Mohini Kasar", "Mohit Sarode", "Mujahid Bagwan",
                    "Nandini Rasal", "Nandini Wahane", "Naushin Sayyad", "Neha Patil", "Neha Wagh", "Neha Kothavade",
                    "Neha Ahire", "Nidhi Kumari", "Niket Malviya", "Nikhil Shingare", "Nikhil Dubey", "Nikhil Nikam", "Nishant Desle",
                    "Nutesh Tajne", "Om Londhe", "Om Pawar", "Omkar Nalawade", "Parikshit Urkande", "Parikshit Patil",
                    "Pooja Athare", "Poonam More", "Pradip Patil", "Prajakta Kamble", "Prajwal Rathod", "Pranali Mahadik",
                    "Pranali Magar", "Pranavkumar Munot", "Pranjali Rane", "Prasad Talekar", "Prashant Patil", "Prateek Gupta",
                    "Prathamesh Maharnur", "Prathmesh Mane", "Pratik Avhad", "Pratik Barse", "Prem Myana", "Priyanka Thange",
                    "Purva Thavai", "Purvesh Khandare", "Rachana Khadse", "Ragini Yadav", "Rahul Pawar", "Raj Tangadi",
                    "Rajat Lonkar", "Ravina Gadekar", "Ritik Gupta", "Rohini Bhagwatkar", "Rohit Bhalse", "Rohit Deshpande", "Ronak Kolhe",
                    "Roshan Kosare", "Rugvedi Wankhede", "Rushikesh Temkar", "Rushikesh Dhavan", "Ruttik Hiwase", "Rutuja Gholap",
                    "Sachin Dabewar", "Sachin Waghchaure", "Sagar Band", "Sagar Udgiri", "Sakshi Baitule", "Sakshi Ostwal",
                    "Sakshi Chaudhari", "Saloni", "Samarth Burkule", "Samiksha Wagaj", "Samir Bharati", "Sanghapal Gavhane",
                    "Sanjukta Sarkar", "Sanket Kulkarni", "Sanket Mandavgane", "Sanket Shalukar", "Sanskruti Dhole", "Sarthak Sambare",
                    "Satyajit Kadam", "Saurabh Mahajan", "Saurabh Walanj", "Saurabh Vaidya", "Shamal Bhujbal", "Shantanu Chaudhari",
                    "Shashibhushan Mishra", "Shilpa Gharat", "Shital Sabale", "Shivanjali Mote", "Shraddha Hade", "Shreya Pandharipande",
                    "Shreya Raj", "Shruti Wadile", "Shruti Jadhav", "Shubham Ghaware", "Shubham Chandrikapure", "Shubham Thakur",
                    "Shubham Rokade", "Shubham Chaudhari", "Siddhi Adkitte", "Sneha Bhong", "Snehal Kharde", "Snehal Shinde",
                    "Sofiya Sutar", "Soma Vasudev", "Someshvar Tiwari", "Soumya Sahu", "Suchit Sawant", "Sudhansu Kapgate",
                    "Sumit Mote", "Supriya Suryawanshi", "Suraj Rawat", "Suyog Joshi", "Swapna Saste", "Tanmay Sawant",
                    "Tanmay Raut", "Tanmay Salwe", "Tejal Mahajan", "Tejas Jadhao", "Tushar Gedam", "Tushar Rupnavar",
                    "Tushar Lahamge", "Vaibhav Sonawane", "Vaishakh Malode", "Vaishnavi Salvi", "Vaishnavi Pokale", "Vaishnavi Pardeshi",
                    "Vaishnavi Jagtap", "Varsha Matsagar", "Vasundhara Nanaware", "Vedant Shiradhonkar", "Vedant Mali", "Vedant Padave",
                    "Vibhav Chavan", "Virag Hote", "Vrushabh Bhaskar", "Yash Mankumare", "Yash Bambal", "Yash Patil", "Yukta Jadhav"
                };

                var users = new List<User>();
                var skills = new[] { "C#", "Java", "Python", "React", "Angular", "SQL", "Docker", "Kubernetes", "Azure", "AWS", "Machine Learning", "Data Science", "Figma", "UI/UX", "Node.js", "HTML", "CSS", "JavaScript", "TypeScript", "Go", "Rust", "C++" };
                var bios = new[] { 
                    "Passionate developer exploring new tech.", "Learning every day.", "Tech enthusiast and open source lover.", "Full stack wizard in making.", 
                    "Data nerd and AI enthusiast.", "Design lover with a knack for code.", "Coding is life, coffee is fuel.", "Building the future one line at a time."
                };

                foreach (var fullName in names)
                {
                    var parts = fullName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                    var firstName = parts.Length > 0 ? parts[0] : "User";
                    var lastName = parts.Length > 1 ? parts[parts.Length - 1] : "Name";
                    
                    var cleanFirst = new string(firstName.Where(char.IsLetterOrDigit).ToArray()).ToLower();
                    var cleanLast = new string(lastName.Where(char.IsLetterOrDigit).ToArray()).ToLower();
                    var email = $"{cleanFirst}.{cleanLast}@peergrid.com";
                    int count = 1;
                    while (users.Any(u => u.Email == email)) { email = $"{cleanFirst}.{cleanLast}{count++}@peergrid.com"; }

                    var user = new User
                    {
                        Name = fullName,
                        Email = email,
                        PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes("password123")),
                        Role = "User",
                        Bio = bios[random.Next(bios.Length)],
                        GridPoints = random.Next(0, 5000),
                        LockedPoints = 0,
                        IsAvailable = true,
                        SkillsOffered = new List<string>(),
                        SkillsNeeded = new List<string>(),
                        ProfilePictureUrl = $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(fullName)}&background=random&color=fff",
                        JoinedAt = DateTime.UtcNow.AddDays(-random.Next(0, 365)).AddHours(random.Next(0, 24)).AddMinutes(random.Next(0, 60))
                    };

                    int offerCount = random.Next(1, 4);
                    for (int i = 0; i < offerCount; i++) {
                        var skill = skills[random.Next(skills.Length)];
                        if (!user.SkillsOffered.Contains(skill)) user.SkillsOffered.Add(skill);
                    }
                    int needCount = random.Next(1, 4);
                    for (int i = 0; i < needCount; i++) {
                        var skill = skills[random.Next(skills.Length)];
                        if (!user.SkillsNeeded.Contains(skill) && !user.SkillsOffered.Contains(skill)) user.SkillsNeeded.Add(skill);
                    }
                    users.Add(user);
                }
                context.Users.AddRange(users);
                context.SaveChanges();
                Console.WriteLine($"Seeded {users.Count} users.");
            }
            else
            {
                Console.WriteLine("Users already exist. Skipping user seeding.");
            }

            // Ensure Admin Exists
            if (!context.Users.Any(u => u.Email == "admin@peergrid.com"))
            {
                var admin = new User {
                    Name = "Admin User", Email = "admin@peergrid.com", PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes("password123")),
                    Role = "Admin", Bio = "System Administrator", GridPoints = 10000, LockedPoints = 0, IsAvailable = true,
                    SkillsOffered = new List<string> { "System Administration" }, SkillsNeeded = new List<string>(),
                    ProfilePictureUrl = "https://ui-avatars.com/api/?name=Admin+User&background=000&color=fff"
                };
                context.Users.Add(admin);
                context.SaveChanges();
            }

            // Load Users for relationships
            var dbUsers = context.Users.ToList();

            // 2. Ensure Webinars Exist
            if (!context.Webinars.Any())
            {
                var webinarTitles = new[] {
                    "Mastering React Hooks", "Intro to Spring Boot Microservices", "AI for Developers", "Docker Zero to Hero", "Figma for Developers", "Kubernetes Basics",
                    "Advanced Java Concurrency", "Python Data Science Toolkit", "Effective Resume Writing", "System Design Interview Prep", "AWS Cloud Essentials", "Next.js 14 Deep Dive"
                };
                var webinars = new List<Webinar>();
                foreach (var title in webinarTitles)
                {
                    var host = dbUsers[random.Next(dbUsers.Count)];
                    webinars.Add(new Webinar {
                        Title = title, Description = $"Join us for {title}.", HostId = host.Id,
                        ScheduledTime = DateTime.Now.AddDays(random.Next(30)).AddHours(random.Next(12)),
                        DurationMinutes = 60, Cost = random.Next(5) * 50, MeetingLink = "https://meet.google.com/abc-defg-hij"
                    });
                }
                context.Webinars.AddRange(webinars);
                context.SaveChanges();
                Console.WriteLine($"Seeded {webinars.Count} webinars.");
            }
            else
            {
                Console.WriteLine("Webinars already exist. Skipping webinar seeding.");
            }

            // 3. Ensure Sessions/Transactions/Feedbacks/Messages Exist
            if (!context.Sessions.Any())
            {
                var sessionTopics = new[] { "React Help", "Java Debugging", "Architecture Review", "Code Review", "Exam Prep", "Mock Interview" };
                var sessions = new List<Session>();
                var transactions = new List<Transaction>();
                var feedbacks = new List<Feedback>();
                var messages = new List<Message>();
                var statusOptions = new[] { "Completed", "Pending", "Cancelled", "Active", "Open" };

                for (int i = 0; i < 50; i++)
                {
                    var learner = dbUsers[random.Next(dbUsers.Count)];
                    var status = statusOptions[random.Next(statusOptions.Length)];
                    
                    User tutor = null;
                    int? tutorId = null;

                    if (status != "Open")
                    {
                        tutor = dbUsers[random.Next(dbUsers.Count)];
                        while (tutor.Id == learner.Id) tutor = dbUsers[random.Next(dbUsers.Count)];
                        tutorId = tutor.Id;
                    }

                    var startTime = DateTime.Now.AddDays(random.Next(-30, 30));
                    var topic = (status == "Open") 
                        ? (learner.SkillsNeeded.Any() ? learner.SkillsNeeded.First() : "General")
                        : (tutor.SkillsOffered.FirstOrDefault() ?? "General");

                    var session = new Session {
                        LearnerId = learner.Id, TutorId = tutorId, Title = sessionTopics[random.Next(sessionTopics.Length)],
                        Description = "Help required.", Topic = topic,
                        StartTime = startTime, EndTime = startTime.AddHours(1), Status = status, Cost = random.Next(1, 10) * 10
                    };
                    sessions.Add(session);

                    if (status == "Completed" && tutor != null) {
                        transactions.Add(new Transaction {
                            LearnerId = learner.Id, TutorId = tutor.Id, Skill = session.Topic, Points = session.Cost,
                            Type = "Transfer", Timestamp = session.EndTime, Rating = random.Next(3, 6)
                        });
                        var feedbackComments = new[] { 
                            "Great session!", "Very helpful, thanks!", "Learned a lot today.", 
                            "Good tutor.", "Excellent explanation.", "Cleared my doubts perfectly.", 
                            "Highly recommended.", "Patient and knowledgeable.", "Helped me debug the issue.", "Fantastic mentor!" 
                        };
                        feedbacks.Add(new Feedback {
                            Session = session, FromUserId = learner.Id, Rating = random.Next(3, 6), 
                            Comment = feedbackComments[random.Next(feedbackComments.Length)]
                        });
                    }

                    if (status != "Open" && tutor != null) {
                        var conversations = new[] {
                            new[] { "Hi, I have a few questions about the session topic.", "Sure, I'd be happy to help. What specific areas are you looking at?", "Mostly around the advanced concepts.", "Great, we can cover that. See you in the session!" },
                            new[] { "Is the schedule fixed or can we move it by 30 mins?", "I can accommodate a 30 min delay. Let's meet then.", "Perfect, thank you!", "No problem." },
                            new[] { "Do I need to install any software beforehand?", "Yes, please have VS Code and Node.js ready.", "Okay, I will set them up.", "See you soon." },
                            new[] { "I'm really excited for this mentorship!", "Me too! We'll make good progress.", "I've prepared some notes.", "That's excellent. It will help us focus." }
                        };
                        
                        var selectedConversation = conversations[random.Next(conversations.Length)];
                        
                        for(int m=0; m<selectedConversation.Length; m++) {
                            messages.Add(new Message {
                                SenderId = (m % 2 == 0) ? learner.Id : tutor.Id, 
                                ReceiverId = (m % 2 == 0) ? tutor.Id : learner.Id,
                                Content = selectedConversation[m], 
                                Timestamp = startTime.AddMinutes(m * 10 - 60), // Messages happened before session or during start
                                IsRead = true
                            });
                        }
                    }
                }
                context.Sessions.AddRange(sessions);
                context.Transactions.AddRange(transactions);
                context.Feedbacks.AddRange(feedbacks);
                context.Messages.AddRange(messages);
                context.SaveChanges();
                Console.WriteLine("Seeded 50 sessions and related data.");
            }
            else
            {
                Console.WriteLine("Sessions already exist. Skipping session seeding.");
            }

            // 3.1 Ensure there are active "Open" doubts
            var openDoubtsCount = context.Sessions.Count(s => s.Status == "Open");
            if (openDoubtsCount < 10)
            {
                Console.WriteLine($"Low number of Open doubts ({openDoubtsCount}), seeding more...");
                var dbUsersForDoubts = context.Users.ToList();
                if (dbUsersForDoubts.Any())
                {
                    var sessionTopics = new[] { "React Help", "Java Debugging", "Architecture Review", "Code Review", "Exam Prep", "Mock Interview", "Spring Boot Error", "CSS Alignment" };
                    var newDoubts = new List<Session>();
                    for (int i = 0; i < 15; i++)
                    {
                        var learner = dbUsersForDoubts[random.Next(dbUsersForDoubts.Count)];
                        var s = new Session
                        {
                            LearnerId = learner.Id,
                            TutorId = null, // Open doubt
                            Title = sessionTopics[random.Next(sessionTopics.Length)],
                            Description = "I need help with this specific issue. Can anyone assist?",
                            Topic = learner.SkillsNeeded.Any() ? learner.SkillsNeeded.First() : "General",
                            StartTime = DateTime.Now.AddHours(random.Next(24)),
                            EndTime = DateTime.Now.AddHours(random.Next(24) + 1),
                            Status = "Open",
                            Cost = random.Next(1, 11) * 10 
                        };
                        newDoubts.Add(s);
                    }
                    context.Sessions.AddRange(newDoubts);
                    context.SaveChanges();
                    Console.WriteLine($"Seeded {newDoubts.Count} new Open doubts.");
                }
            }

            // 4. Ensure ALL users have at least THREE sessions (Confirmed or Completed) with Chat History
            var allUsers = context.Users.Where(u => u.Role != "Admin").ToList();
            if (allUsers.Any())
            {
                var now = DateTime.Now;
                foreach (var user in allUsers)
                {
                    int currentSessionCount = context.Sessions.Count(s => s.LearnerId == user.Id || (s.TutorId != null && s.TutorId == user.Id));
                    int sessionsNeeded = 3 - currentSessionCount;

                    if (sessionsNeeded > 0)
                    {
                        for (int k = 0; k < sessionsNeeded; k++)
                        {
                            var other = allUsers.Where(u => u.Id != user.Id).OrderBy(x => random.Next()).FirstOrDefault();
                            if (other != null)
                            {
                                var session = new Session();
                                bool isLearner = random.Next(2) == 0;
                                
                                int learnerId = isLearner ? user.Id : other.Id;
                                int tutorId = isLearner ? other.Id : user.Id;
                                
                                session.LearnerId = learnerId;
                                session.TutorId = tutorId;
                                
                                var skillSource = isLearner ? other : user; 
                                var topic = skillSource.SkillsOffered.Any() ? skillSource.SkillsOffered[random.Next(skillSource.SkillsOffered.Count)] : "General";

                                session.Title = topic + " Session";
                                session.Description = "Discussing " + topic;
                                session.Topic = topic;
                                session.Cost = random.Next(1, 6) * 100;
                                
                                // Randomize Status (Confirmed or Completed)
                                bool isCompleted = random.Next(2) == 0;
                                session.Status = isCompleted ? "Completed" : "Confirmed";
                                
                                if (isCompleted) {
                                    session.StartTime = DateTime.Now.AddDays(-random.Next(1, 30)).AddHours(random.Next(12));
                                } else {
                                    session.StartTime = DateTime.Now.AddDays(random.Next(1, 14)).AddHours(random.Next(12));
                                }
                                session.EndTime = session.StartTime.AddHours(1);

                                context.Sessions.Add(session);
                                
                                // Add Chat History
                                var conversations = new[] {
                                    new[] { "Hi, looking forward to our session!", "Same here! Do you have the agenda?", "Yes, I'll share it shortly.", "Great, thanks." },
                                    new[] { "Just confirming our time.", "Yes, seeing you then.", "Perfect.", "Have a good day!" },
                                    new[] { "I have some questions about " + topic, "Sure, list them out.", "I will send them via email.", "Okay, sounds good." },
                                    new[] { "Can we reschedule by 10 mins?", "No problem, see you then.", "Thanks for understanding.", "You're welcome." }
                                };
                                var selectedConversation = conversations[random.Next(conversations.Length)];
                                for(int m=0; m<selectedConversation.Length; m++) {
                                    context.Messages.Add(new Message {
                                        SenderId = (m % 2 == 0) ? learnerId : tutorId, 
                                        ReceiverId = (m % 2 == 0) ? tutorId : learnerId,
                                        Content = selectedConversation[m], 
                                        Timestamp = session.StartTime.AddMinutes(m * 10 - 60), // Before session
                                        IsRead = true
                                    });
                                }

                                // If Completed, Add Transaction and Feedback
                                if (isCompleted)
                                {
                                    context.Transactions.Add(new Transaction {
                                        LearnerId = learnerId, TutorId = tutorId, Skill = topic, Points = session.Cost,
                                        Type = "Transfer", Timestamp = session.EndTime, Rating = random.Next(3, 6)
                                    });

                                    var feedbackComments = new[] { "Great session!", "Very helpful.", "Good mentor.", "Learned a lot." };
                                    context.Feedbacks.Add(new Feedback {
                                        Session = session, FromUserId = learnerId, Rating = random.Next(3, 6), 
                                        Comment = feedbackComments[random.Next(feedbackComments.Length)]
                                    });
                                }

                                Console.WriteLine($"Seeded {session.Status} session for {user.Name}");
                            }
                        }
                    }
                }
                context.SaveChanges();
            }
        }
    }
}
