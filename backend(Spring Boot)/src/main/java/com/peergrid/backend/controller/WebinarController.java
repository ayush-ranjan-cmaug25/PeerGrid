package com.peergrid.backend.controller;

import com.peergrid.backend.entity.Webinar;
import com.peergrid.backend.entity.User;
import com.peergrid.backend.repository.WebinarRepository;
import com.peergrid.backend.repository.UserRepository;
import com.peergrid.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/webinars")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class WebinarController {

    @Autowired
    private WebinarRepository webinarRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // Get all upcoming webinars
    @GetMapping
    public List<Webinar> getAllWebinars() {
        return webinarRepository.findByScheduledTimeAfterOrderByScheduledTimeAsc(LocalDateTime.now());
    }

    // Create a new webinar (Host only? Anyone can host? Let's assume anyone logged in)
    @PostMapping
    public ResponseEntity<?> createWebinar(@RequestBody Webinar webinar, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        User host = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        webinar.setHost(host);
        // Ensure webinar time is in future?
        if (webinar.getScheduledTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Cannot schedule webinar in the past.");
        }

        Webinar saved = webinarRepository.save(webinar);
        return ResponseEntity.ok(saved);
    }

    // Register for a webinar
    @PostMapping("/{id}/register")
    public ResponseEntity<?> registerForWebinar(@PathVariable Integer id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Webinar webinar = webinarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Webinar not found"));
        
        if (webinar.getRegisteredUserIds().contains(user.getId())) {
             return ResponseEntity.badRequest().body("Already registered.");
        }

        BigDecimal cost = webinar.getCost();
        if (user.getGridPoints().compareTo(cost) < 0) {
            return ResponseEntity.badRequest().body("Insufficient Grid Points.");
        }

        // Deduct points
        user.setGridPoints(user.getGridPoints().subtract(cost));
        userRepository.save(user);

        // Add user to webinar
        webinar.getRegisteredUserIds().add(user.getId());
        webinarRepository.save(webinar);

        // Send Email
        emailService.sendWebinarRegistrationEmail(
            user.getEmail(), 
            user.getName(), 
            webinar.getTitle(), 
            webinar.getScheduledTime().toString(), 
            webinar.getMeetingLink() != null ? webinar.getMeetingLink() : "Link will be shared soon"
        );

        return ResponseEntity.ok(Map.of("message", "Registered successfully!", "newBalance", user.getGridPoints()));
    }
}
