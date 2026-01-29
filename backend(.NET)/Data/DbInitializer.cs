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

            // Check if data already exists
            if (context.Users.Any())
            {
                if (!context.Users.Any(u => u.Email == "admin@peergrid.com"))
                {
                    var admin = new User
                    {
                        Name = "Admin User",
                        Email = "admin@peergrid.com",
                        PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes("password123")),
                        Role = "Admin",
                        Bio = "System Administrator",
                        GridPoints = 10000,
                        LockedPoints = 0,
                        IsAvailable = true,
                        SkillsOffered = new List<string> { "System Administration" },
                        SkillsNeeded = new List<string>(),
                        ProfilePictureUrl = "https://ui-avatars.com/api/?name=Admin+User&background=000&color=fff"
                    };
                    context.Users.Add(admin);
                    context.SaveChanges();
                }
                return;
            }

            // Clear existing data in correct order to avoid FK constraints
            if (context.Messages.Any()) context.Messages.RemoveRange(context.Messages);
            if (context.Sessions.Any()) context.Sessions.RemoveRange(context.Sessions);
            if (context.Transactions.Any()) context.Transactions.RemoveRange(context.Transactions);
            if (context.Feedbacks.Any()) context.Feedbacks.RemoveRange(context.Feedbacks);
            if (context.Users.Any()) context.Users.RemoveRange(context.Users);
            
            context.SaveChanges();

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
            var random = new Random();
            var skills = new[] { "C#", "Java", "Python", "React", "Angular", "SQL", "Docker", "Kubernetes", "Azure", "AWS", "Machine Learning", "Data Science", "Figma", "UI/UX", "Node.js", "HTML", "CSS", "JavaScript", "TypeScript", "Go", "Rust", "C++" };
            var bios = new[] { 
                "Passionate developer exploring new tech.", 
                "Learning every day.", 
                "Tech enthusiast and open source lover.", 
                "Full stack wizard in making.", 
                "Data nerd and AI enthusiast.", 
                "Design lover with a knack for code.", 
                "Coding is life, coffee is fuel.", 
                "Building the future one line at a time.",
                "Student eager to learn.",
                "Professional developer helping others."
            };

            foreach (var fullName in names)
            {
                var parts = fullName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                var firstName = parts.Length > 0 ? parts[0] : "User";
                var lastName = parts.Length > 1 ? parts[parts.Length - 1] : "Name";
                
                // Clean up names for email
                var cleanFirst = new string(firstName.Where(char.IsLetterOrDigit).ToArray()).ToLower();
                var cleanLast = new string(lastName.Where(char.IsLetterOrDigit).ToArray()).ToLower();
                
                var email = $"{cleanFirst}.{cleanLast}@peergrid.com";
                
                // Ensure unique email
                int count = 1;
                while (users.Any(u => u.Email == email))
                {
                    email = $"{cleanFirst}.{cleanLast}{count}@peergrid.com";
                    count++;
                }

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

                // Add random skills offered
                int offerCount = random.Next(1, 4);
                for (int i = 0; i < offerCount; i++)
                {
                    var skill = skills[random.Next(skills.Length)];
                    if (!user.SkillsOffered.Contains(skill)) user.SkillsOffered.Add(skill);
                }

                // Add random skills needed
                int needCount = random.Next(1, 4);
                for (int i = 0; i < needCount; i++)
                {
                    var skill = skills[random.Next(skills.Length)];
                    if (!user.SkillsNeeded.Contains(skill) && !user.SkillsOffered.Contains(skill)) user.SkillsNeeded.Add(skill);
                }

                users.Add(user);
            }

            // Add Admin User
            var adminUser = new User
            {
                Name = "Admin User",
                Email = "admin@peergrid.com",
                PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes("password123")),
                Role = "Admin",
                Bio = "System Administrator",
                GridPoints = 10000,
                LockedPoints = 0,
                IsAvailable = true,
                SkillsOffered = new List<string> { "System Administration" },
                SkillsNeeded = new List<string>(),
                ProfilePictureUrl = "https://ui-avatars.com/api/?name=Admin+User&background=000&color=fff"
            };
            users.Add(adminUser);

            context.Users.AddRange(users);
            context.SaveChanges();
        }
    }
}
