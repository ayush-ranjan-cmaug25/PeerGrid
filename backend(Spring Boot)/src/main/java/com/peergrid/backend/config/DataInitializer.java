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
                user.setJoinedAt(java.time.LocalDateTime.now().minusDays(random.nextInt(365)).minusHours(random.nextInt(24)).minusMinutes(random.nextInt(60)));
                
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
                
                String topic = "General";
                if ("Open".equals(status)) {
                    topic = learner.getSkillsNeeded().isEmpty() ? "General" : learner.getSkillsNeeded().get(0);
                } else if (tutor != null) {
                    topic = tutor.getSkillsOffered().isEmpty() ? "General" : tutor.getSkillsOffered().get(0);
                }
                session.setTopic(topic);
                
                session.setStartTime(startTime); session.setEndTime(startTime.plusHours(1));
                session.setStatus(status); session.setCost(new BigDecimal(random.nextInt(10) * 10 + 10));
                sessions.add(session);
            }
            
            sessions = sessionRepository.saveAll(sessions);

            for (com.peergrid.backend.entity.Session session : sessions) {
                 if ("Completed".equals(session.getStatus())) {
                    com.peergrid.backend.entity.Transaction transaction = new com.peergrid.backend.entity.Transaction();
                    transaction.setLearner(session.getLearner()); 
                    transaction.setTutor(session.getTutor());
                    transaction.setSkill(session.getTopic()); 
                    transaction.setPoints(session.getCost());
                    transaction.setType("Transfer"); 
                    transaction.setTimestamp(session.getEndTime());
                    // Match .NET: Random rating 3 to 5 (inclusive 3, exclusive 6 in .NET = 3,4,5)
                    transaction.setRating((double) (random.nextInt(3) + 3));
                    transactions.add(transaction);

                    com.peergrid.backend.entity.Feedback feedback = new com.peergrid.backend.entity.Feedback();
                    feedback.setSession(session); 
                    feedback.setFromUserId(session.getLearner().getId());
                    // Match .NET: Random rating 3 to 5
                    feedback.setRating(random.nextInt(3) + 3); 
                    String[] feedbackComments = { 
                        "Great session!", "Very helpful, thanks!", "Learned a lot today.", 
                        "Good tutor.", "Excellent explanation.", "Cleared my doubts perfectly.", 
                        "Highly recommended.", "Patient and knowledgeable.", "Helped me debug the issue.", "Fantastic mentor!" 
                    };
                    feedback.setComment(feedbackComments[random.nextInt(feedbackComments.length)]);
                    feedbacks.add(feedback);
                }
                
                String[][] conversations = {
                    { "Hi, I have a few questions about the session topic.", "Sure, I'd be happy to help. What specific areas are you looking at?", "Mostly around the advanced concepts.", "Great, we can cover that. See you in the session!" },
                    { "Is the schedule fixed or can we move it by 30 mins?", "I can accommodate a 30 min delay. Let's meet then.", "Perfect, thank you!", "No problem." },
                    { "Do I need to install any software beforehand?", "Yes, please have VS Code and Node.js ready.", "Okay, I will set them up.", "See you soon." },
                    { "I'm really excited for this mentorship!", "Me too! We'll make good progress.", "I've prepared some notes.", "That's excellent. It will help us focus." }
                };
                
                String[] selectedConversation = conversations[random.nextInt(conversations.length)];

                for(int m=0; m<selectedConversation.length; m++) {
                    com.peergrid.backend.entity.Message msg = new com.peergrid.backend.entity.Message();
                    msg.setSender((m % 2 == 0) ? session.getLearner() : session.getTutor());
                    msg.setReceiver((m % 2 == 0) ? session.getTutor() : session.getLearner());
                    msg.setContent(selectedConversation[m]);
                    msg.setTimestamp(session.getStartTime().plusMinutes(m * 10 - 60)); // Messages happened before session
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

        
        // 4. Ensure ALL users have at least THREE sessions (Confirmed or Completed) with Chat History
        List<User> allUsers = userRepository.findAll().stream()
                .filter(u -> !"Admin".equals(u.getRole()))
                .collect(java.util.stream.Collectors.toList());
        for (User user : allUsers) {
            long currentSessionCount = sessionRepository.findAll().stream()
                    .filter(s -> (s.getLearner().getId().equals(user.getId()) || (s.getTutor() != null && s.getTutor().getId().equals(user.getId()))))
                    .count();
            
            long sessionsNeeded = 3 - currentSessionCount;

            if (sessionsNeeded > 0) {
                for (int k = 0; k < sessionsNeeded; k++) {
                    allUsers.stream()
                            .filter(u -> !u.getId().equals(user.getId()))
                            .findAny()
                            .ifPresent(other -> {
                                com.peergrid.backend.entity.Session session = new com.peergrid.backend.entity.Session();
                                
                                boolean isLearner = random.nextBoolean();
                                User learner = isLearner ? user : other;
                                User tutor = isLearner ? other : user;

                                session.setLearner(learner);
                                session.setTutor(tutor);
                                
                                User skillSource = isLearner ? other : user;
                                String topic = skillSource.getSkillsOffered().isEmpty() ? "General" : skillSource.getSkillsOffered().get(random.nextInt(skillSource.getSkillsOffered().size()));
                                
                                session.setTitle(topic + " Session");
                                session.setDescription("Discussing " + topic);
                                session.setTopic(topic);
                                session.setCost(new BigDecimal(random.nextInt(5) * 100 + 100));
                                
                                // Randomize Status
                                boolean isCompleted = random.nextBoolean();
                                session.setStatus(isCompleted ? "Completed" : "Confirmed");
                                
                                if (isCompleted) {
                                    session.setStartTime(java.time.LocalDateTime.now().minusDays(random.nextInt(30) + 1).plusHours(random.nextInt(12)));
                                } else {
                                    session.setStartTime(java.time.LocalDateTime.now().plusDays(random.nextInt(14) + 1).plusHours(random.nextInt(12)));
                                }
                                session.setEndTime(session.getStartTime().plusHours(1));
                                
                                session = sessionRepository.save(session);
                                
                                // Add Chat History
                                String[][] conversations = {
                                    { "Hi, looking forward to our session!", "Same here! Do you have the agenda?", "Yes, I'll share it shortly.", "Great, thanks." },
                                    { "Just confirming our time.", "Yes, seeing you then.", "Perfect.", "Have a good day!" },
                                    { "I have some questions about " + topic, "Sure, list them out.", "I will send them via email.", "Okay, sounds good." },
                                    { "Can we reschedule by 10 mins?", "No problem, see you then.", "Thanks for understanding.", "You're welcome." }
                                };
                                String[] selectedConversation = conversations[random.nextInt(conversations.length)];
                                List<com.peergrid.backend.entity.Message> newMessages = new ArrayList<>();
                                for(int m=0; m<selectedConversation.length; m++) {
                                    com.peergrid.backend.entity.Message msg = new com.peergrid.backend.entity.Message();
                                    msg.setSender((m % 2 == 0) ? learner : tutor);
                                    msg.setReceiver((m % 2 == 0) ? tutor : learner);
                                    msg.setContent(selectedConversation[m]);
                                    msg.setTimestamp(session.getStartTime().plusMinutes(m * 10 - 60)); 
                                    msg.setRead(true);
                                    newMessages.add(msg);
                                }
                                messageRepository.saveAll(newMessages);

                                // If Completed, Add Transaction and Feedback
                                if (isCompleted) {
                                    com.peergrid.backend.entity.Transaction transaction = new com.peergrid.backend.entity.Transaction();
                                    transaction.setLearner(learner); transaction.setTutor(tutor);
                                    transaction.setSkill(topic); transaction.setPoints(session.getCost());
                                    transaction.setType("Transfer"); transaction.setTimestamp(session.getEndTime());
                                    transaction.setRating((double) (random.nextInt(3) + 3));
                                    transactionRepository.save(transaction);

                                    com.peergrid.backend.entity.Feedback feedback = new com.peergrid.backend.entity.Feedback();
                                    feedback.setSession(session); 
                                    feedback.setFromUserId(learner.getId());
                                    feedback.setRating(random.nextInt(3) + 3); 
                                    String[] feedbackComments = { "Great session!", "Very helpful.", "Good mentor.", "Learned a lot." };
                                    feedback.setComment(feedbackComments[random.nextInt(feedbackComments.length)]);
                                    feedbackRepository.save(feedback);
                                }

                                System.out.println("Seeded " + session.getStatus() + " session for " + user.getName());
                            });
                }
            }
        }
    }
}
