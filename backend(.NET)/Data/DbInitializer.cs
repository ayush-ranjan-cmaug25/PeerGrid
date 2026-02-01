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
                    "Aakash Ashok Kharade", "Aasif Jamal", "Abhishek Anilkumar Borse", "Abhishek Dasondhi", "Abhishek Narayan Jagtap", "Abhishek Vilas Gaikwad",
                    "Adarsh Kumar Chandel", "Adarsh Kushwah", "Aditya Abhijeet Adhikari", "Aditya Sachin Korde", "Afsha Zarreen Sayeed Khan", "Ajay Raysing Patil",
                    "Akanksha Jeevan Puri", "Akanksha Somnath Dhanawade", "Akash Pandurang Kokulwar", "Akash Raghunath Bhadane", "Akshay Keshav Balte", "Amar Balasaheb Toge",
                    "Amarnath Ambadas Malpuri", "Amey Arun Parab", "Amey Shekhar Raut", "Aniket Bhagwat Sherkar", "Aniket Hanumant Darade", "Anirudha Dinesh Shinde",
                    "Ankita Ashok Kanthe", "Ankita Yatin Kher", "Annu Yadav", "Anuj Trivedi", "Anurag More", "Anushka Chavan", "Apurva Nandkishor Dhonde",
                    "Aryan Genbhau Gawade", "Aryan Manohar Pate", "Aryan Sunil Shambharkar", "Asfiya Naveed Ahmed Shaikh", "Asmit Ajay Upganlawar", "Asmita Vijaykumar Mhetre",
                    "Atharva Anil Thumbare", "Avneesh Dubey", "Ayush Ranjan", "Bhagyesh Tushar Wani", "Bhavna Yadav Balpande", "Bhushan Chandan Dhavan",
                    "Bhushan Narendra Attarde", "Bhushan Vasantrao Thate", "Chaitali Bhagwat Barhate", "Chetankumar Badusing Banjara", "Chinmay Vijay Bonde", "Darshan Suryabhan Gadakh",
                    "Darshana Sopandas Malewar", "Deepa Sushil Jadhav", "Deepra Banerjee", "Devendra Kakaji Deore", "Dhananjay Tansen Shitole", "Dhanashree Deepak Pawar",
                    "Dhaval Manik Patil", "Dhiraj Divakar Patil", "Digvijay Maruti Thanekar", "Dipak Chandrakant Firake", "Dipali Amit Vasave", "Dipti Sampat Akhade",
                    "Dnyaneshvar Bibhishan Suryavanshi", "Fameshwari", "Gaurav Anil Patil", "Gaurav Anil Sontakke", "Gaurav Aniruddha Apte", "Gaurav Baikunth Nath Mishra",
                    "Gaurav Suresh Salunkhe", "Gauri Pratul Kolte", "Goutam Soni", "Gunjan Pravin Chaudhari", "Hanuman Bhagwat Jadhav", "Harshal Vilas Tarmale",
                    "Heramb Dilip Shinde", "Himanshu Dhananjay Patil", "Himanshu Jagdish Samrit", "Hitesh Ravindra Singh Chaudhari", "Hrishikesh Deepak Tappe", "Isha Anant Puranik",
                    "Isha Pralhad Gulhane", "Ishan Raizada", "Jaydeep Patidar", "Kalyanee Ravindra Pachghare", "Kamlini Govardhan Bhasme", "Kapil Umakant Katte",
                    "Kaushal Rajendra Patil", "Khetesh Ummedram Choudhary", "Kiran Vishwas Mahajan", "Komal Kadnor", "Komal Ramrao Jadhav", "Krishna Aditya Chikkala",
                    "Krushna Vikas Chavan", "Madhuri Kedarnath Chavan", "Manali Sharad Bharati Bhujbal", "Manish Laxmikant Chaudhari", "Mickey Manohar", "Minal Ashok Kamde",
                    "Mohammad Rehan Ansari", "Mohammad Salik Zameer Ahmed Mulla", "Mohd Allahuddin", "Mohini Nikhil Kasar", "Mohit Rahul Sarode", "Mujahid Jamshed Bagwan",
                    "Nandini Nitin Rasal", "Nandini Wasant Wahane", "Naushin Yusuf Sayyad", "Neha Devidas Patil", "Neha Nandu Wagh", "Neha Pravin Kothavade",
                    "Neha Vijay Ahire", "Nidhi Kumari", "Niket Devendra Malviya", "Nikhil Anil Shingare", "Nikhil Dubey", "Nikhil Samadhan Nikam", "Nishant Sharad Desle",
                    "Nutesh Vinod Tajne", "Om Bhagirath Londhe", "Om Santosh Pawar", "Omkar Pramod Nalawade", "Parikshit Mahendra Urkande", "Parikshit Vijay Patil",
                    "Pooja Kundlik Athare", "Poonam Balaji More", "Pradip Prakash Patil", "Prajakta Manik Kamble", "Prajwal Rathod", "Pranali Ramesh Mahadik",
                    "Pranali Vilas Magar", "Pranavkumar Sanjay Munot", "Pranjali Pramod Rane", "Prasad Sagar Talekar", "Prashant Aba Patil", "Prateek Gupta",
                    "Prathamesh Sunil Maharnur", "Prathmesh Mane", "Pratik Ashok Avhad", "Pratik Kailas Barse", "Prem Satyanarayan Myana", "Priyanka Bhausaheb Thange",
                    "Purva Pradeep Thavai", "Purvesh Ravindra Khandare", "Rachana Namdeo Khadse", "Ragini Yadav", "Rahul Dhondu Pawar", "Raj Jaydev Tangadi",
                    "Rajat Lonkar", "Ravina Punjarao Gadekar", "Ritik Gupta", "Rohini Bhagwatkar", "Rohit Bhalse", "Rohit Deshpande", "Ronak Ravindra Kolhe",
                    "Roshan Sanjay Kosare", "Rugvedi Dilipkumar Wankhede", "Rushikesh Sandeep Temkar", "Rushikesh Vijay Dhavan", "Ruttik Prakash Hiwase", "Rutuja Pravin Gholap",
                    "Sachin Rajesh Dabewar", "Sachin Sanjay Waghchaure", "Sagar Band", "Sagar Shyam Udgiri", "Sakshi Purushottam Baitule", "Sakshi Sandip Ostwal",
                    "Sakshi Umesh Chaudhari", "Saloni", "Samarth Ramchandra Burkule", "Samiksha Vilas Wagaj", "Samir Bharati", "Sanghapal Ishwar Gavhane",
                    "Sanjukta Sarkar", "Sanket Kulkarni", "Sanket Purushottam Mandavgane", "Sanket Sanjay Shalukar", "Sanskruti Shankar Dhole", "Sarthak Satish Sambare",
                    "Satyajit Tanaji Kadam", "Saurabh Anil Mahajan", "Saurabh Pramod Walanj", "Saurabh Raju Vaidya", "Shamal Manik Bhujbal", "Shantanu Laxman Chaudhari",
                    "Shashibhushan Avdhesh Mishra", "Shilpa Jayesh Gharat", "Shital Janardan Sabale", "Shivanjali Bhanudas Mote", "Shraddha Chandrashekhar Hade", "Shreya Ajay Pandharipande",
                    "Shreya Raj", "Shruti Dhanalal Wadile", "Shruti Dinkar Jadhav", "Shubham Chandrakant Ghaware", "Shubham Chandrikapure", "Shubham Dnyaneshwar Thakur",
                    "Shubham Santosh Rokade", "Shubham Shriram Chaudhari", "Siddhi Machhindra Adkitte", "Sneha Gorakhnath Bhong", "Snehal Kailas Kharde", "Snehal Shivaji Shinde",
                    "Sofiya Taiyaballi Sutar", "Soma Vasudev", "Someshvar Tiwari", "Soumya Prasad Sahu", "Suchit Prashant Sawant", "Sudhansu Dalchand Kapgate",
                    "Sumit Prabhakar Mote", "Supriya Mahesh Suryawanshi", "Suraj Rawat", "Suyog Avinash Joshi", "Swapna Sanjay Saste", "Tanmay Chandrakant Sawant",
                    "Tanmay Mukesh Raut", "Tanmay Vasant Salwe", "Tejal Sunil Mahajan", "Tejas Anil Jadhao", "Tushar Gajanan Gedam", "Tushar Hanmant Rupnavar",
                    "Tushar Vilas Lahamge", "Vaibhav Sanjay Sonawane", "Vaishakh Lalchand Malode", "Vaishnavi Dhanaji Salvi", "Vaishnavi Dhanraj Pokale", "Vaishnavi Pramod Pardeshi",
                    "Vaishnavi Sanjay Jagtap", "Varsha Shivaji Matsagar", "Vasundhara Vitthal Nanaware", "Vedant Ramrao Shiradhonkar", "Vedant Suryakant Mali", "Vedant Vishwanath Padave",
                    "Vibhav Vikas Chavan", "Virag Hote", "Vrushabh Vyankatesh Bhaskar", "Yash Gulabrao Mankumare", "Yash Pramod Bambal", "Yash Sunil Patil", "Yukta Ravindra Jadhav"
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
                        ProfilePictureUrl = $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(fullName)}&background=random&color=fff"
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
                        feedbacks.Add(new Feedback {
                            Session = session, FromUserId = learner.Id, Rating = random.Next(3, 6), Comment = "Great session!"
                        });
                    }

                    if (status != "Open" && tutor != null) {
                        int msgCount = random.Next(2, 6);
                        for(int m=0; m<msgCount; m++) {
                            messages.Add(new Message {
                                SenderId = (m % 2 == 0) ? learner.Id : tutor.Id, ReceiverId = (m % 2 == 0) ? tutor.Id : learner.Id,
                                Content = (m % 2 == 0) ? "Hi, can you help?" : "Sure, I'm available.", Timestamp = startTime.AddMinutes(m * 5), IsRead = true
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
        }
    }
}
