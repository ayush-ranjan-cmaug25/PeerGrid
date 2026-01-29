package com.peergrid.backend.config;

import com.peergrid.backend.entity.User;
import com.peergrid.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;

import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (userRepository.count() > 0) {
            if (userRepository.findByEmail("admin@peergrid.com").isEmpty()) {
                 User admin = new User();
                 admin.setName("Admin User");
                 admin.setEmail("admin@peergrid.com");
                 admin.setPasswordHash(java.util.Base64.getEncoder().encodeToString("password123".getBytes()));
                 admin.setRole("Admin");
                 admin.setBio("System Administrator");
                 admin.setGridPoints(new BigDecimal(10000));
                 admin.setLockedPoints(BigDecimal.ZERO);
                 admin.setAvailable(true);
                 admin.setProfilePictureUrl("https://ui-avatars.com/api/?name=Admin+User&background=000&color=fff");
                 admin.getSkillsOffered().add("System Administration");
                 userRepository.save(admin);
                 System.out.println("Admin user created.");
            }

            return;
        }

        // Clear existing data in correct order to avoid FK constraints
        messageRepository.deleteAll();
        sessionRepository.deleteAll();
        transactionRepository.deleteAll();
        feedbackRepository.deleteAll();
        userRepository.deleteAll();

        String[] names = {
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

        List<User> users = new ArrayList<>();
        Random random = new Random();
        String[] skills = { "C#", "Java", "Python", "React", "Angular", "SQL", "Docker", "Kubernetes", "Azure", "AWS", "Machine Learning", "Data Science", "Figma", "UI/UX", "Node.js", "HTML", "CSS", "JavaScript", "TypeScript", "Go", "Rust", "C++" };
        String[] bios = { 
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

        for (String fullName : names) {
            String[] parts = fullName.split(" ");
            String firstName = parts.length > 0 ? parts[0] : "User";
            String lastName = parts.length > 1 ? parts[parts.length - 1] : "Name";
            
            // Clean up names for email
            String cleanFirst = firstName.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
            String cleanLast = lastName.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
            
            String email = cleanFirst + "." + cleanLast + "@peergrid.com";
            
            // Ensure unique email
            int count = 1;
            String candidateEmail = email;
            while (true) {
                String finalCandidate = candidateEmail;
                boolean exists = users.stream().anyMatch(u -> u.getEmail().equals(finalCandidate));
                if (!exists) {
                    break;
                }
                candidateEmail = cleanFirst + "." + cleanLast + count + "@peergrid.com";
                count++;
            }
            String finalEmail = candidateEmail;

            User user = new User();
            user.setName(fullName);
            user.setEmail(finalEmail);
            user.setPasswordHash(java.util.Base64.getEncoder().encodeToString("password123".getBytes())); // Matches AuthController Base64 logic
            user.setRole("User");
            user.setBio(bios[random.nextInt(bios.length)]);
            user.setGridPoints(new BigDecimal(random.nextInt(5000)));
            user.setLockedPoints(BigDecimal.ZERO);
            user.setAvailable(true);
            user.setProfilePictureUrl("https://ui-avatars.com/api/?name=" + fullName.replace(" ", "+") + "&background=random&color=fff");

            // Add random skills offered
            int offerCount = random.nextInt(3) + 1; // 1 to 3
            for (int i = 0; i < offerCount; i++) {
                String skill = skills[random.nextInt(skills.length)];
                if (!user.getSkillsOffered().contains(skill)) {
                    user.getSkillsOffered().add(skill);
                }
            }

            // Add random skills needed
            int needCount = random.nextInt(3) + 1; // 1 to 3
            for (int i = 0; i < needCount; i++) {
                String skill = skills[random.nextInt(skills.length)];
                if (!user.getSkillsNeeded().contains(skill) && !user.getSkillsOffered().contains(skill)) {
                    user.getSkillsNeeded().add(skill);
                }
            }

            users.add(user);
        }

        // Add Admin User
        User admin = new User();
        admin.setName("Admin User");
        admin.setEmail("admin@peergrid.com");
        admin.setPasswordHash(java.util.Base64.getEncoder().encodeToString("password123".getBytes()));
        admin.setRole("Admin");
        admin.setBio("System Administrator");
        admin.setGridPoints(new BigDecimal(10000));
        admin.setLockedPoints(BigDecimal.ZERO);
        admin.setAvailable(true);
        admin.setProfilePictureUrl("https://ui-avatars.com/api/?name=Admin+User&background=000&color=fff");
        admin.getSkillsOffered().add("System Administration");
        users.add(admin);

        userRepository.saveAll(users);
        System.out.println("Database seeded with " + users.size() + " users.");
    }
}
