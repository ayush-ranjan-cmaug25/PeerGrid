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

    @Autowired private UserRepository userRepository;
    @Autowired private MessageRepository messageRepository;
    @Autowired private SessionRepository sessionRepository;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private FeedbackRepository feedbackRepository;
    @Autowired private WebinarRepository webinarRepository;

    @Override
    public void run(String... args) throws Exception {
        Random random = new Random();

        // 1. Ensure Users Exist
        if (userRepository.count() == 0) {
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
            String[] skills = { "C#", "Java", "Python", "React", "Angular", "SQL", "Docker", "Kubernetes", "Azure", "AWS", "Machine Learning", "Data Science", "Figma", "UI/UX", "Node.js", "HTML", "CSS", "JavaScript", "TypeScript", "Go", "Rust", "C++" };
            String[] bios = { "Passionate developer.", "Learning every day.", "Tech enthusiast.", "Full stack wizard.", "Data nerd.", "Design lover.", "Coding is life.", "Building the future.", "Student eager to learn.", "Professional developer." };
            
            List<User> userList = new ArrayList<>();
            for (String fullName : names) {
                String[] parts = fullName.split(" ");
                String firstName = parts.length > 0 ? parts[0] : "User";
                String lastName = parts.length > 1 ? parts[parts.length - 1] : "Name";
                String cleanFirst = firstName.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
                String cleanLast = lastName.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
                String email = cleanFirst + "." + cleanLast + "@peergrid.com";
                int count = 1;
                final String baseEmail = email;
                while (userList.stream().anyMatch(u -> u.getEmail().equals(baseEmail))) { email = cleanFirst + "." + cleanLast + count++ + "@peergrid.com"; }
                
                User user = new User();
                user.setName(fullName); user.setEmail(email);
                user.setPasswordHash(java.util.Base64.getEncoder().encodeToString("password123".getBytes()));
                user.setRole("User"); user.setBio(bios[random.nextInt(bios.length)]);
                user.setGridPoints(new BigDecimal(random.nextInt(5000))); user.setLockedPoints(BigDecimal.ZERO); user.setAvailable(true);
                user.setProfilePictureUrl("https://ui-avatars.com/api/?name=" + fullName.replace(" ", "+") + "&background=random&color=fff");
                
                int offerCount = random.nextInt(3) + 1;
                for (int i = 0; i < offerCount; i++) {
                    String skill = skills[random.nextInt(skills.length)];
                    if (!user.getSkillsOffered().contains(skill)) user.getSkillsOffered().add(skill);
                }
                int needCount = random.nextInt(3) + 1;
                for (int i = 0; i < needCount; i++) {
                    String skill = skills[random.nextInt(skills.length)];
                    if (!user.getSkillsNeeded().contains(skill) && !user.getSkillsOffered().contains(skill)) user.getSkillsNeeded().add(skill);
                }
                userList.add(user);
            }
            userRepository.saveAll(userList);
            System.out.println("Seeded " + userList.size() + " users.");
        } else {
            System.out.println("Users already exist. Skipping user seeding.");
        }

        // Ensure Admin
        if (userRepository.findByEmail("admin@peergrid.com").isEmpty()) {
             User admin = new User();
             admin.setName("Admin User"); admin.setEmail("admin@peergrid.com");
             admin.setPasswordHash(java.util.Base64.getEncoder().encodeToString("password123".getBytes()));
             admin.setRole("Admin"); admin.setBio("System Administrator");
             admin.setGridPoints(new BigDecimal(10000)); admin.setLockedPoints(BigDecimal.ZERO);
             admin.setAvailable(true); admin.setProfilePictureUrl("https://ui-avatars.com/api/?name=Admin+User&background=000&color=fff");
             admin.getSkillsOffered().add("System Administration");
             userRepository.save(admin);
        }

        List<User> dbUsers = userRepository.findAll();
        
        // 2. Ensure Webinars
        if (webinarRepository.count() == 0) {
            String[] webinarTitles = {
                "Mastering React Hooks", "Intro to Spring Boot Microservices", "AI for Developers", "Docker Zero to Hero", "Figma for Developers", "Kubernetes Basics",
                "Advanced Java Concurrency", "Python Data Science Toolkit", "Effective Resume Writing", "System Design Interview Prep", "AWS Cloud Essentials", "Next.js 14 Deep Dive"
            };
            List<com.peergrid.backend.entity.Webinar> webinars = new ArrayList<>();
            for (String title : webinarTitles) {
                com.peergrid.backend.entity.Webinar w = new com.peergrid.backend.entity.Webinar();
                w.setTitle(title); w.setDescription("Join us for " + title + ".");
                w.setHost(dbUsers.get(random.nextInt(dbUsers.size())));
                w.setScheduledTime(java.time.LocalDateTime.now().plusDays(random.nextInt(30)).plusHours(random.nextInt(12)));
                w.setDurationMinutes(60); w.setCost(new BigDecimal(random.nextInt(5) * 50)); w.setMeetingLink("https://meet.google.com/abc-defg-hij");
                webinars.add(w);
            }
            webinarRepository.saveAll(webinars);
            System.out.println("Seeded " + webinars.size() + " webinars.");
        } else {
             System.out.println("Webinars already exist. Skipping webinar seeding.");
        }

        // 3. Ensure Sessions/Transactions/Feedbacks/Messages
        if (sessionRepository.count() == 0) {
            String[] sessionTopics = { "React Help", "Java Debugging", "Architecture Review", "Code Review", "Exam Prep", "Mock Interview" };
            List<com.peergrid.backend.entity.Session> sessions = new ArrayList<>();
            List<com.peergrid.backend.entity.Transaction> transactions = new ArrayList<>();
            List<com.peergrid.backend.entity.Feedback> feedbacks = new ArrayList<>();
            List<com.peergrid.backend.entity.Message> messages = new ArrayList<>();
            String[] statuses = { "Completed", "Pending", "Cancelled", "Active", "Open" };

            for (int i = 0; i < 50; i++) {
                User learner = dbUsers.get(random.nextInt(dbUsers.size()));
                
                String status = statuses[random.nextInt(statuses.length)];
                User tutor = null;
                if (!"Open".equals(status)) {
                    tutor = dbUsers.get(random.nextInt(dbUsers.size()));
                    while (tutor.getId().equals(learner.getId())) tutor = dbUsers.get(random.nextInt(dbUsers.size()));
                }
                
                java.time.LocalDateTime startTime = java.time.LocalDateTime.now().plusDays(random.nextInt(60) - 30);
                
                com.peergrid.backend.entity.Session session = new com.peergrid.backend.entity.Session();
                session.setLearner(learner); session.setTutor(tutor);
                session.setTitle(sessionTopics[random.nextInt(sessionTopics.length)]);
                session.setDescription("Help needed.");
                session.setTopic(learner.getSkillsNeeded().isEmpty() ? "General" : learner.getSkillsNeeded().get(0)); // Use learner's needed skill for doubt
                session.setStartTime(startTime); session.setEndTime(startTime.plusHours(1));
                session.setStatus(status); session.setCost(new BigDecimal(random.nextInt(10) * 10 + 10));
                sessions.add(session);
            }
            
            sessions = sessionRepository.saveAll(sessions);

            for (com.peergrid.backend.entity.Session session : sessions) {
                 if ("Completed".equals(session.getStatus())) {
                    com.peergrid.backend.entity.Transaction transaction = new com.peergrid.backend.entity.Transaction();
                    transaction.setLearner(session.getLearner()); transaction.setTutor(session.getTutor());
                    transaction.setSkill(session.getTopic()); transaction.setPoints(session.getCost());
                    transaction.setType("Transfer"); transaction.setTimestamp(session.getEndTime());
                    transaction.setRating((double) (random.nextInt(3) + 3));
                    transactions.add(transaction);

                    com.peergrid.backend.entity.Feedback feedback = new com.peergrid.backend.entity.Feedback();
                    feedback.setSession(session); feedback.setFromUserId(session.getLearner().getId());
                    feedback.setRating(random.nextInt(3) + 3); feedback.setComment("Great session!");
                    feedbacks.add(feedback);
                }
                
                int msgCount = random.nextInt(4) + 2;
                for(int m=0; m<msgCount; m++) {
                    com.peergrid.backend.entity.Message msg = new com.peergrid.backend.entity.Message();
                    msg.setSender((m % 2 == 0) ? session.getLearner() : session.getTutor());
                    msg.setReceiver((m % 2 == 0) ? session.getTutor() : session.getLearner());
                    msg.setContent((m % 2 == 0) ? "Hi, can you help?" : "Sure.");
                    msg.setTimestamp(session.getStartTime().plusMinutes(m * 5));
                    msg.setRead(true);
                    messages.add(msg);
                }
            }
            transactionRepository.saveAll(transactions);
            feedbackRepository.saveAll(feedbacks);
            messageRepository.saveAll(messages);
            System.out.println("Seeded sessions, transactions, feedbacks, and messages.");
        } else {
            System.out.println("Sessions already exist. Skipping session seeding.");
        }

        // 3.1 Ensure there are active "Open" doubts
        long openDoubtsCount = sessionRepository.findAll().stream()
                .filter(s -> "Open".equals(s.getStatus()))
                .count();

        if (openDoubtsCount < 10) {
            System.out.println("Low number of Open doubts (" + openDoubtsCount + "), seeding more...");
            List<User> usersForDoubts = userRepository.findAll();
            if(!usersForDoubts.isEmpty()) {
                String[] sessionTopics = { "React Help", "Java Debugging", "Architecture Review", "Code Review", "Exam Prep", "Mock Interview", "Spring Boot Error", "CSS Alignment" };
                List<com.peergrid.backend.entity.Session> newDoubts = new ArrayList<>();
                for (int i = 0; i < 15; i++) {
                    User learner = usersForDoubts.get(random.nextInt(usersForDoubts.size()));
                    com.peergrid.backend.entity.Session session = new com.peergrid.backend.entity.Session();
                    session.setLearner(learner);
                    session.setTutor(null); // Open doubt
                    session.setTitle(sessionTopics[random.nextInt(sessionTopics.length)]);
                    session.setDescription("I need help with this specific issue. Can anyone assist?");
                    session.setTopic(learner.getSkillsNeeded().isEmpty() ? "General" : learner.getSkillsNeeded().get(0));
                    session.setStartTime(java.time.LocalDateTime.now().plusHours(random.nextInt(24)));
                    session.setEndTime(session.getStartTime().plusHours(1));
                    session.setStatus("Open");
                    session.setCost(new BigDecimal(random.nextInt(10) * 10 + 10));
                    newDoubts.add(session);
                }
                sessionRepository.saveAll(newDoubts);
                System.out.println("Seeded " + newDoubts.size() + " new Open doubts.");
            }
        }

        
        // 4. Ensure ALL users have at least one upcoming confirmed session
        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            long upcomingCount = sessionRepository.findAll().stream()
                    .filter(s -> (s.getLearner().getId().equals(user.getId()) || (s.getTutor() != null && s.getTutor().getId().equals(user.getId())))
                            && "Confirmed".equals(s.getStatus()) && s.getStartTime().isAfter(java.time.LocalDateTime.now()))
                    .count();

            if (upcomingCount == 0) {
                // Find a random partner different from current user
                 allUsers.stream()
                        .filter(u -> !u.getId().equals(user.getId()))
                        .findAny() // Use findAny for non-deterministic selection if stream allows, or just pick one
                        .ifPresent(other -> {
                            com.peergrid.backend.entity.Session session = new com.peergrid.backend.entity.Session();
                            
                            // 50% chance to be learner, 50% chance to be tutor
                            boolean isLearner = random.nextBoolean();
                            if (isLearner) {
                                session.setLearner(user);
                                session.setTutor(other);
                            } else {
                                session.setLearner(other);
                                session.setTutor(user);
                            }
                            
                            String topic = user.getSkillsOffered().isEmpty() ? "General" : user.getSkillsOffered().get(random.nextInt(user.getSkillsOffered().size()));
                            
                            session.setTitle(topic + " Mentorship");
                            session.setDescription("Deep dive into " + topic);
                            session.setTopic(topic);
                            session.setCost(new BigDecimal(random.nextInt(5) * 100 + 100)); // 100-500 points
                            session.setStatus("Confirmed");
                            // Schedule 1 to 5 days in the future
                            session.setStartTime(java.time.LocalDateTime.now().plusDays(random.nextInt(5) + 1).plusHours(random.nextInt(12)));
                            session.setEndTime(session.getStartTime().plusHours(1));
                            
                            sessionRepository.save(session);
                            System.out.println("Seeded confirmed session for " + user.getName());
                        });
            }
        }
    }
}
