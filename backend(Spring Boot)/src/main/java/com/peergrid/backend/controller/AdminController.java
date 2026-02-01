package com.peergrid.backend.controller;

import com.peergrid.backend.entity.Feedback;
import com.peergrid.backend.entity.Session;
import com.peergrid.backend.entity.Transaction;
import com.peergrid.backend.entity.User;
import com.peergrid.backend.entity.Log;
import com.peergrid.backend.repository.FeedbackRepository;
import com.peergrid.backend.repository.LogRepository;
import com.peergrid.backend.repository.SessionRepository;
import com.peergrid.backend.repository.TransactionRepository;
import com.peergrid.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private LogRepository logRepository;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> banUser(@PathVariable Integer id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // 1. Get Sessions
        List<Session> tutorSessions = sessionRepository.findByTutorId(id);
        List<Session> learnerSessions = sessionRepository.findByLearnerId(id);
        List<Session> allSessions = new java.util.ArrayList<>();
        allSessions.addAll(tutorSessions);
        allSessions.addAll(learnerSessions);

        // 2. Delete Feedbacks for these sessions
        for (Session s : allSessions) {
             List<Feedback> feedbacks = feedbackRepository.findBySessionId(s.getId());
             feedbackRepository.deleteAll(feedbacks);
        }

        // 3. Delete Sessions
        sessionRepository.deleteAll(allSessions);

        // 4. Delete Transactions
        List<Transaction> transactions = transactionRepository.findByLearnerIdOrTutorId(id, id);
        transactionRepository.deleteAll(transactions);

        // 5. Delete User
        userRepository.deleteById(id);
        logAction("Admin", "User Deleted", "Admin", "Deleted user ID: " + id);
        return ResponseEntity.ok().body(Map.of("message", "User deleted successfully"));
    }

    @PutMapping("/users/{id}/gp")
    public ResponseEntity<?> adjustUserGP(@PathVariable Integer id, @RequestBody BigDecimal amount) {
        return userRepository.findById(id).map(user -> {
            user.setGridPoints(user.getGridPoints().add(amount));
            userRepository.save(user);
            String action = amount.compareTo(BigDecimal.ZERO) >= 0 ? "GP Added" : "GP Removed";
            logAction("Admin", action, "Admin", "Adjusted GP for user ID: " + id + " by " + amount);
            return ResponseEntity.ok().body(Map.of("message", "User GP updated successfully", "newBalance", user.getGridPoints()));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return userRepository.findById(id).map(user -> {
            if ("Banned".equalsIgnoreCase(status)) {
                user.setBanned(true);
            } else if ("Active".equalsIgnoreCase(status)) {
                user.setBanned(false);
            }
            userRepository.save(user);
            logAction("Admin", "User Status Updated", "Admin", "Updated status of user ID: " + id + " to " + status);
            return ResponseEntity.ok().body(Map.of("message", "User status updated successfully", "banned", user.isBanned()));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sessions")
    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        long totalUsers = userRepository.count();
        List<Session> allSessions = sessionRepository.findAll();
        long activeSessions = allSessions.stream().filter(s -> "Active".equals(s.getStatus())).count();
        long activeBounties = allSessions.stream().filter(s -> s.getTutor() == null && "Open".equals(s.getStatus())).count();
        long pendingReports = 0;

        // Calculate session history for the last 7 days
        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.format.DateTimeFormatter dayFormatter = java.time.format.DateTimeFormatter.ofPattern("EEE"); // Mon, Tue...
        
        List<Map<String, Object>> sessionsHistory = java.util.stream.IntStream.range(0, 7)
            .map(i -> 6 - i) // 6, 5, 4, 3, 2, 1, 0 (days ago)
            .mapToObj(daysAgo -> {
                java.time.LocalDate date = today.minusDays(daysAgo);
                long count = allSessions.stream()
                    .filter(s -> s.getStartTime() != null && s.getStartTime().toLocalDate().equals(date))
                    .count();
                Map<String, Object> datapoint = new HashMap<>();
                datapoint.put("label", date.format(dayFormatter));
                datapoint.put("value", count);
                return datapoint;
            })
            .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("activeSessions", activeSessions);
        stats.put("activeBounties", activeBounties);
        stats.put("pendingReports", pendingReports);
        stats.put("sessionsHistory", sessionsHistory);
        return stats;
    }

    @GetMapping("/bounties")
    public List<Session> getBounties() {
        return sessionRepository.findAll().stream()
                .filter(s -> s.getTutor() == null)
                .collect(Collectors.toList());
    }

    @GetMapping("/skills")
    public List<Map<String, Object>> getSkills() {
        List<User> users = userRepository.findAll();
        Map<String, Long> skillCounts = users.stream()
                .flatMap(u -> u.getSkillsOffered().stream())
                .collect(Collectors.groupingBy(s -> s, Collectors.counting()));

        return skillCounts.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .limit(5)
                .map(e -> Map.of("label", (Object)e.getKey(), "value", (Object)e.getValue()))
                .collect(Collectors.toList());
    }

    @GetMapping("/transactions")
    public List<Transaction> getTransactions() {
        return transactionRepository.findAll().stream()
                .sorted((t1, t2) -> t2.getTimestamp().compareTo(t1.getTimestamp()))
                .limit(100)
                .collect(Collectors.toList());
    }

    @GetMapping("/feedbacks")
    public List<Feedback> getFeedbacks() {
        return feedbackRepository.findAll();
    }

    @GetMapping("/logs")
    public List<Log> getLogs() {
        if (logRepository.count() == 0) {
            // Seed dummy data
            // Fetch actual users from DB
            List<String> dbUsers = userRepository.findAll().stream().map(User::getEmail).collect(Collectors.toList());
            if (dbUsers.isEmpty()) {
                dbUsers.add("System");
            }

            java.util.Random random = new java.util.Random();

            for (int i = 0; i < 50; i++) {
                String type = "";
                String action = "";
                String details = "";
                
                int typeChoice = i % 6;
                switch (typeChoice) {
                    case 0:
                        type = "Security";
                        String[] secActions = { "Login Attempt", "Password Changed", "New Registration" };
                        action = secActions[random.nextInt(secActions.length)];
                        if (action.equals("Login Attempt")) details = "Failed login attempt from IP: 192.168.1." + random.nextInt(255);
                        else if (action.equals("Password Changed")) details = "User changed password successfully.";
                        else details = "New user registered with email verification pending.";
                        break;
                    case 1:
                        type = "User Action";
                        String[] userActions = { "Session Created", "Profile Updated" };
                        action = userActions[random.nextInt(userActions.length)];
                        if (action.equals("Session Created")) details = "Created session 'Introduction to React' with tutor ID: " + (random.nextInt(900) + 100);
                        else details = "Updated bio and skills.";
                        break;
                    case 2:
                        type = "System";
                        String[] sysActions = { "Backup Completed", "System Maintenance" };
                        action = sysActions[random.nextInt(sysActions.length)];
                        if (action.equals("Backup Completed")) details = "Daily database backup completed successfully. Size: " + (random.nextInt(450) + 50) + "MB";
                        else details = "Scheduled maintenance executed. Duration: " + (random.nextInt(4900) + 100) + "ms";
                        break;
                    case 3:
                        type = "Admin";
                        String[] adminActions = { "User Banned", "GP Added", "GP Removed" };
                        action = adminActions[random.nextInt(adminActions.length)];
                        if (action.equals("User Banned")) details = "Banned user for violation of terms.";
                        else if (action.equals("GP Added")) details = "Admin added " + (random.nextInt(490) + 10) + " GP to user account.";
                        else details = "Admin removed " + (random.nextInt(490) + 10) + " GP from user account.";
                        break;
                    case 4:
                        type = "Error";
                        String[] errActions = { "Payment Timeout", "Database Connection Failed" };
                        action = errActions[random.nextInt(errActions.length)];
                        if (action.equals("Payment Timeout")) details = "Gateway timeout during transaction ID: TXN-" + (random.nextInt(90000) + 10000);
                        else details = "Connection pool exhausted. Retrying...";
                        break;
                    case 5:
                        type = "Finance";
                        action = "Payment Success";
                        details = "Payment of " + (random.nextInt(4900) + 100) + " INR successful. Order ID: ORD-" + (random.nextInt(90000) + 10000);
                        break;
                }

                Log log = new Log(
                    type,
                    action,
                    dbUsers.get(random.nextInt(dbUsers.size())),
                    details
                );
                // Adjust timestamp to spread logs over time
                log.setTimestamp(java.time.LocalDateTime.now().minusHours(i * 2));
                logRepository.save(log);
            }
        }
        return logRepository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"));
    }

    private void logAction(String type, String action, String user, String details) {
        Log log = new Log(type, action, user, details);
        logRepository.save(log);
    }

    @PostMapping("/seed")
    public ResponseEntity<?> seedData() {
        List<User> users = userRepository.findAll();
        if (users.size() < 2) {
            return ResponseEntity.badRequest().body("Need at least 2 users (including current one) to seed meaningful interactions.");
        }

        java.util.Random random = new java.util.Random();

        // 1. Seed Sessions (Past 7 Days + Future)
        for (int i = 0; i < 35; i++) {
            Session s = new Session();
            User tutor = users.get(random.nextInt(users.size()));
            User learner = users.get(random.nextInt(users.size()));

            // Ensure different users
            int retries = 0;
            while (learner.getId().equals(tutor.getId()) && retries < 5) {
                learner = users.get(random.nextInt(users.size()));
                retries++;
            }
            if (learner.getId().equals(tutor.getId())) continue;

            s.setTutor(tutor);
            s.setLearner(learner);

            String[] topics = {"React Hooks Deep Dive", "Spring Boot Security", "Python Data Analysis", "AWS Lambda Deployment", "Docker Compose Masterclass", "Figma Prototyping", "Rust Concurrency", "Go Microservices"};
            String topic = topics[random.nextInt(topics.length)];
            s.setTitle(topic);
            s.setTopic(topic);
            s.setDescription("In-depth session covering " + topic + " with practical examples.");

            // Random time in last 7 days or next 2 days
            // 80% past, 20% future
            boolean isPast = random.nextDouble() < 0.8;
            LocalDateTime time;
            if (isPast) {
                time = LocalDateTime.now().minusDays(random.nextInt(7)).minusHours(random.nextInt(12));
            } else {
                time = LocalDateTime.now().plusDays(random.nextInt(2)).plusHours(random.nextInt(12));
            }
            s.setStartTime(time);
            s.setEndTime(time.plusHours(1));

            // Status logic
            if (!isPast) {
                s.setStatus("Pending"); // Future usually Pending or Confirmed
            } else {
                String[] pastStatuses = {"Completed", "Completed", "Completed", "Active", "Cancelled"}; // Mostly completed
                s.setStatus(pastStatuses[random.nextInt(pastStatuses.length)]);
            }

            s.setCost(new BigDecimal(random.nextInt(90) + 10)); // 10-100 GP
            sessionRepository.save(s);
        }

        // 2. Seed Bounties (Open Sessions)
        for (int i = 0; i < 12; i++) {
            Session s = new Session();
            User learner = users.get(random.nextInt(users.size()));
            s.setLearner(learner);
            
            String[] commonIssues = {"Fix CSS Grid Layout", "Debug NullPointerException", "Help with Redux Toolkit", "Deploy to Vercel", "Optimize SQL Query"};
            String topic = commonIssues[random.nextInt(commonIssues.length)];
            
            s.setTitle(topic);
            s.setTopic(topic);
            s.setDescription("I am stuck with " + topic + ". Need expert help!");
            s.setStatus("Open");
            s.setCost(new BigDecimal(random.nextInt(40) + 10));
            sessionRepository.save(s);
        }

        // 3. Seed Transactions
        for (int i = 0; i < 25; i++) {
            Transaction t = new Transaction();
            User tutor = users.get(random.nextInt(users.size()));
            User learner = users.get(random.nextInt(users.size()));
            
             // Ensure different users
            if (learner.getId().equals(tutor.getId())) continue;
            
            t.setTutor(tutor);
            t.setLearner(learner);
            
            String[] skills = {"React", "Java", "Python", "AWS", "Design"};
            t.setSkill(skills[random.nextInt(skills.length)]);
            
            t.setPoints(new BigDecimal(random.nextInt(450) + 50));
            t.setType("Transfer");
            t.setTimestamp(LocalDateTime.now().minusDays(random.nextInt(7)).minusHours(random.nextInt(24)));
            
            transactionRepository.save(t);
        }

        logAction("System", "Data Seeded", "Admin", "Populated database with dummy sessions and transactions.");
        
        return ResponseEntity.ok(Map.of("message", "Database successfully populated with using existing users."));
    }
}
