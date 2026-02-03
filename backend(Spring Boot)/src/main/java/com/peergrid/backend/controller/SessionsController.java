package com.peergrid.backend.controller;

import com.peergrid.backend.dto.BookSessionRequest;
import com.peergrid.backend.dto.CreateDoubtRequest;
import com.peergrid.backend.dto.CompleteSessionRequest;
import com.peergrid.backend.dto.RateSessionRequest;
import com.peergrid.backend.entity.Session;
import com.peergrid.backend.entity.Transaction;
import com.peergrid.backend.entity.User;
import com.peergrid.backend.repository.SessionRepository;
import com.peergrid.backend.repository.UserRepository;
import com.peergrid.backend.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Objects;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
public class SessionsController {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Map<String, Object>>> getMySessions() {
        User user = getAuthenticatedUser();
        Integer userId = user.getId();

        List<Session> sessions = sessionRepository.findAll().stream()
                .filter(s -> (s.getTutor() != null && s.getTutor().getId().equals(userId)) || s.getLearner().getId().equals(userId))
                .sorted((s1, s2) -> s2.getStartTime().compareTo(s1.getStartTime()))
                .collect(Collectors.toList());

        List<Map<String, Object>> response = sessions.stream().map(s -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", s.getId());
            map.put("topic", s.getTopic());
            map.put("title", s.getTitle());
            map.put("description", s.getDescription());
            map.put("otherParty", (s.getTutor() != null && s.getTutor().getId().equals(userId)) ? s.getLearner().getName() : (s.getTutor() != null ? s.getTutor().getName() : "Open"));
            map.put("otherPartyId", (s.getTutor() != null && s.getTutor().getId().equals(userId)) ? s.getLearner().getId() : (s.getTutor() != null ? s.getTutor().getId() : null));
            map.put("learnerId", s.getLearner().getId());
            map.put("tutorId", s.getTutor() != null ? s.getTutor().getId() : null);
            map.put("time", s.getStartTime());
            map.put("status", s.getStatus());
            map.put("cost", s.getCost());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/doubts")
    public ResponseEntity<List<Map<String, Object>>> getDoubts() {
        List<Session> doubts = sessionRepository.findAll().stream()
                .filter(s -> "Open".equals(s.getStatus()))
                .sorted((s1, s2) -> s2.getId().compareTo(s1.getId()))
                .collect(Collectors.toList());

        List<Map<String, Object>> response = doubts.stream().map(s -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", s.getId());
            map.put("title", s.getTitle());
            map.put("description", s.getDescription());
            map.put("topic", s.getTopic());
            map.put("points", s.getCost());
            map.put("learner", s.getLearner().getName());
            map.put("learnerId", s.getLearner().getId());
            map.put("tags", new String[]{s.getTopic()});
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/doubts")
    public ResponseEntity<?> createDoubt(@RequestBody CreateDoubtRequest request) {
        try {
            User user = getAuthenticatedUser();
            if (user.getId() == null) throw new RuntimeException("User ID is null");
            Session session = sessionService.createDoubt(Objects.requireNonNull(user.getId()), request.getTitle(), request.getDescription(), request.getTopic(), request.getBounty());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Doubt posted successfully");
            response.put("doubtId", session.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/accept/{id}")
    public ResponseEntity<?> acceptDoubt(@PathVariable Integer id) {
        try {
            if (id == null) throw new RuntimeException("Session ID is required");
            User user = getAuthenticatedUser();
            if (user.getId() == null) throw new RuntimeException("User ID is null");
            sessionService.acceptDoubt(Objects.requireNonNull(id), Objects.requireNonNull(user.getId()));
            return ResponseEntity.ok(Map.of("message", "Doubt accepted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookSession(@RequestBody BookSessionRequest request) {
        try {
            if (request.getLearnerId() == null || request.getTutorId() == null) throw new RuntimeException("Learner and Tutor IDs are required");
            sessionService.bookSession(Objects.requireNonNull(request.getLearnerId()), Objects.requireNonNull(request.getTutorId()), request.getCost(), request.getTopic(), request.getStartTime());
            return ResponseEntity.ok(Map.of("message", "Session booked successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/accept-request/{id}")
    public ResponseEntity<?> acceptSessionRequest(@PathVariable Integer id) {
        try {
            if (id == null) throw new RuntimeException("Session ID is required");
            sessionService.acceptSessionRequest(id);
            return ResponseEntity.ok(Map.of("message", "Session request accepted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/reject-request/{id}")
    public ResponseEntity<?> rejectSessionRequest(@PathVariable Integer id) {
        try {
            if (id == null) throw new RuntimeException("Session ID is required");
            sessionService.rejectSessionRequest(id);
            return ResponseEntity.ok(Map.of("message", "Session request rejected"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/complete")
    public ResponseEntity<?> completeSession(@RequestBody CompleteSessionRequest request) {
        try {
            if (request.getLearnerId() == null || request.getTutorId() == null) throw new RuntimeException("Learner and Tutor IDs are required");
            Transaction tx = sessionService.completeSession(Objects.requireNonNull(request.getLearnerId()), Objects.requireNonNull(request.getTutorId()), request.getCost());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Session completed successfully");
            response.put("transactionId", tx.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/rate")
    public ResponseEntity<?> rateSession(@RequestBody RateSessionRequest request) {
        try {
            if (request.getTransactionId() == null) throw new RuntimeException("Transaction ID is required");
            sessionService.rateSession(Objects.requireNonNull(request.getTransactionId()), request.getSessionId(), request.getRating(), request.getComment());
            return ResponseEntity.ok(Map.of("message", "Session rated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
