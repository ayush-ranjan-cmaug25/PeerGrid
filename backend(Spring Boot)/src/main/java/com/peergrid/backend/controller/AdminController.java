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
        userRepository.deleteById(id);
        logAction("Admin", "User Banned", "Admin", "Banned user ID: " + id);
        return ResponseEntity.ok().body(Map.of("message", "User banned/deleted successfully"));
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

    @GetMapping("/sessions")
    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        long totalUsers = userRepository.count();
        long activeSessions = sessionRepository.findAll().stream().filter(s -> "Active".equals(s.getStatus())).count();
        long activeBounties = sessionRepository.findAll().stream().filter(s -> s.getTutor() == null && "Open".equals(s.getStatus())).count();
        long pendingReports = 0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("activeSessions", activeSessions);
        stats.put("activeBounties", activeBounties);
        stats.put("pendingReports", pendingReports);
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
}
