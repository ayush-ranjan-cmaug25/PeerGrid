package com.peergrid.backend.controller;

import com.peergrid.backend.dto.SessionDto;
import com.peergrid.backend.dto.UserDto;
import com.peergrid.backend.entity.Session;
import com.peergrid.backend.entity.Transaction;
import com.peergrid.backend.entity.User;
import com.peergrid.backend.repository.SessionRepository;
import com.peergrid.backend.repository.TransactionRepository;
import com.peergrid.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UsersController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMe() {
        User user = getAuthenticatedUser();
        Integer userId = user.getId();

        List<Session> allSessions = sessionRepository.findAll(); // Optimization: use custom query
        List<Transaction> allTransactions = transactionRepository.findAll(); // Optimization: use custom query

        long totalSessions = allSessions.stream()
                .filter(s -> (s.getTutor() != null && s.getTutor().getId().equals(userId) || s.getLearner().getId().equals(userId)) && "Completed".equals(s.getStatus()))
                .count();

        double hoursTaught = allSessions.stream()
                .filter(s -> s.getTutor() != null && s.getTutor().getId().equals(userId) && "Completed".equals(s.getStatus()))
                .mapToDouble(s -> Duration.between(s.getStartTime(), s.getEndTime()).toMinutes() / 60.0)
                .sum();

        double averageRating = allTransactions.stream()
                .filter(t -> t.getTutor() != null && t.getTutor().getId().equals(userId) && t.getRating() != null)
                .mapToDouble(Transaction::getRating)
                .average()
                .orElse(0.0);

        List<SessionDto> recentSessions = allSessions.stream()
                .filter(s -> (s.getTutor() != null && s.getTutor().getId().equals(userId)) || s.getLearner().getId().equals(userId))
                .sorted((s1, s2) -> s2.getStartTime().compareTo(s1.getStartTime()))
                .limit(3)
                .map(s -> {
                    SessionDto dto = new SessionDto();
                    dto.setId(s.getId());
                    dto.setTopic(s.getTopic());
                    dto.setOtherParty(s.getTutor() != null && s.getTutor().getId().equals(userId) ? s.getLearner().getName() : (s.getTutor() != null ? s.getTutor().getName() : "Unknown"));
                    dto.setOtherPartyId(s.getTutor() != null && s.getTutor().getId().equals(userId) ? s.getLearner().getId() : (s.getTutor() != null ? s.getTutor().getId() : null));
                    dto.setTutorId(s.getTutor() != null ? s.getTutor().getId() : null);
                    dto.setLearnerId(s.getLearner() != null ? s.getLearner().getId() : null);
                    dto.setTime(s.getStartTime());
                    dto.setStatus(s.getStatus());
                    return dto;
                })
                .collect(Collectors.toList());

        List<String> badges = new ArrayList<>();
        if (totalSessions >= 5 && averageRating >= 4.0) {
            badges.add("Verified Peer");
        }

        Map<String, Long> skillCounts = allSessions.stream()
                .filter(s -> s.getTutor() != null && s.getTutor().getId().equals(userId) && "Completed".equals(s.getStatus()))
                .collect(Collectors.groupingBy(Session::getTopic, Collectors.counting()));

        skillCounts.forEach((topic, count) -> {
            if (count >= 3) {
                badges.add(topic + " Specialist");
            }
        });

        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setBio(user.getBio());
        dto.setProfilePictureUrl(user.getProfilePictureUrl());
        dto.setSkillsOffered(user.getSkillsOffered());
        dto.setSkillsNeeded(user.getSkillsNeeded());
        dto.setGridPoints(user.getGridPoints());
        dto.setLockedPoints(user.getLockedPoints());
        dto.setAvailable(user.isAvailable());
        dto.setTotalSessions((int) totalSessions);
        dto.setHoursTaught(Math.round(hoursTaught * 10.0) / 10.0);
        dto.setAverageRating(Math.round(averageRating * 10.0) / 10.0);
        dto.setRecentSessions(recentSessions);
        dto.setBadges(badges);

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/top-solvers")
    public ResponseEntity<List<UserDto>> getTopSolvers() {
        List<User> users = userRepository.findAll();
        List<UserDto> topSolvers = users.stream()
                .filter(u -> !"Admin".equalsIgnoreCase(u.getRole()))
                .sorted((u1, u2) -> u2.getGridPoints().compareTo(u1.getGridPoints()))
                .limit(5)
                .map(u -> {
                    UserDto dto = new UserDto();
                    dto.setId(u.getId());
                    dto.setName(u.getName());
                    dto.setGridPoints(u.getGridPoints());
                    dto.setProfilePictureUrl(u.getProfilePictureUrl());
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(topSolvers);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        User user = getAuthenticatedUser();
        Integer userId = user.getId();
        List<Session> allSessions = sessionRepository.findAll();

        List<SessionDto> upcomingSessions = allSessions.stream()
                .filter(s -> (s.getLearner().getId().equals(userId) || (s.getTutor() != null && s.getTutor().getId().equals(userId))) 
                        && ("Confirmed".equals(s.getStatus()) || "Active".equals(s.getStatus())) 
                        && s.getStartTime().isAfter(LocalDateTime.now()))
                .sorted((s1, s2) -> s1.getStartTime().compareTo(s2.getStartTime()))
                .limit(3)
                .map(s -> {
                    SessionDto dto = new SessionDto();
                    dto.setId(s.getId());
                    dto.setTopic(s.getTopic());
                    dto.setOtherParty(s.getTutor() != null && s.getTutor().getId().equals(userId) ? s.getLearner().getName() : (s.getTutor() != null ? s.getTutor().getName() : "Unknown"));
                    dto.setOtherPartyId(s.getTutor() != null && s.getTutor().getId().equals(userId) ? s.getLearner().getId() : (s.getTutor() != null ? s.getTutor().getId() : null));
                    dto.setTutorId(s.getTutor() != null ? s.getTutor().getId() : null);
                    dto.setLearnerId(s.getLearner() != null ? s.getLearner().getId() : null);
                    dto.setTime(s.getStartTime());
                    dto.setStatus(s.getStatus());
                    dto.setCost(s.getCost());
                    return dto;
                })
                .collect(Collectors.toList());

        List<SessionDto> activeDoubts = allSessions.stream()
                .filter(s -> "Open".equals(s.getStatus()))
                .sorted((s1, s2) -> s2.getId().compareTo(s1.getId()))
                .limit(3)
                .map(s -> {
                    SessionDto dto = new SessionDto();
                    dto.setId(s.getId());
                    dto.setTitle(s.getTitle());
                    dto.setDescription(s.getDescription());
                    dto.setPoints(s.getCost());
                    dto.setTags(new String[]{s.getTopic()});
                    return dto;
                })
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("upcomingSessions", upcomingSessions);
        response.put("activeDoubts", activeDoubts);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public List<User> getUsers() {
        return userRepository.findAll().stream()
                .filter(u -> !"Admin".equalsIgnoreCase(u.getRole()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Integer id) {
        if (id == null) return ResponseEntity.badRequest().build();
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(@RequestBody User updatedUser) {
        User user = getAuthenticatedUser();
        
        user.setSkillsOffered(updatedUser.getSkillsOffered());
        user.setSkillsNeeded(updatedUser.getSkillsNeeded());
        user.setBio(updatedUser.getBio());
        user.setName(updatedUser.getName());
        user.setProfilePictureUrl(updatedUser.getProfilePictureUrl());
        
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}
