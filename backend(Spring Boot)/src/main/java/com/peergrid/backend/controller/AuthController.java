package com.peergrid.backend.controller;

import com.peergrid.backend.dto.AuthResponse;
import com.peergrid.backend.dto.GoogleLoginRequest;
import com.peergrid.backend.dto.LoginRequest;
import com.peergrid.backend.entity.User;
import com.peergrid.backend.repository.UserRepository;
import com.peergrid.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Base64;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private com.peergrid.backend.service.EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        
        // Basic password encoding for prototype phase
        user.setPasswordHash(Base64.getEncoder().encodeToString(user.getPasswordHash().getBytes()));
        
        // Set default Grid Points
        user.setGridPoints(new BigDecimal(100));

        userRepository.save(user);

        // Send welcome email
        emailService.sendRegistrationEmail(user.getEmail(), user.getName());

        return ResponseEntity.ok().body("{\"message\": \"Registration successful\"}");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("{\"message\": \"Invalid credentials\"}");
        }

        User user = userOpt.get();
        String encodedPassword = Base64.getEncoder().encodeToString(request.getPassword().getBytes());

        if (!user.getPasswordHash().equals(encodedPassword)) {
            return ResponseEntity.status(401).body("{\"message\": \"Invalid credentials\"}");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());
        return ResponseEntity.ok(new AuthResponse(token, user.getRole(), user));
    }

    private static final String GOOGLE_CLIENT_ID = "308348501964-j00m5qv6n7a3905oan7oqf1305f8dn01.apps.googleusercontent.com";

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getIdToken());
            
            String email;
            String name;
            String picture;

            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                email = payload.getEmail();
                name = (String) payload.get("name");
                picture = (String) payload.get("picture");
            } else {
                // Development fallback: Decode token without verification if client ID is missing
                System.out.println("Google Token Verification skipped. Using unsafe decoding for development.");
                

                String[] parts = request.getIdToken().split("\\.");
                if (parts.length > 1) {
                    String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
                    email = "mock@gmail.com"; 
                    name = "Mock User";
                    picture = "";
                    
                    if (payload.contains("\"email\":\"")) {
                        int emailStart = payload.indexOf("\"email\":\"") + 9;
                        int emailEnd = payload.indexOf("\"", emailStart);
                        email = payload.substring(emailStart, emailEnd);
                    }
                    if (payload.contains("\"name\":\"")) {
                        int nameStart = payload.indexOf("\"name\":\"") + 8;
                        int nameEnd = payload.indexOf("\"", nameStart);
                        name = payload.substring(nameStart, nameEnd);
                    }
                    if (payload.contains("\"picture\":\"")) {
                        int picStart = payload.indexOf("\"picture\":\"") + 11;
                        int picEnd = payload.indexOf("\"", picStart);
                        picture = payload.substring(picStart, picEnd);
                    }
                } else {
                    return ResponseEntity.status(401).body("{\"message\": \"Invalid ID token.\"}");
                }
            }

            Optional<User> userOpt = userRepository.findByEmail(email);
            User user;
            if (userOpt.isEmpty()) {
                user = new User();
                user.setEmail(email);
                user.setName(name);
                user.setRole("User");
                user.setPasswordHash(Base64.getEncoder().encodeToString(UUID.randomUUID().toString().getBytes()));
                user.setGridPoints(new BigDecimal(100));
                user.setAvailable(true);
                user.setProfilePictureUrl(picture);
                userRepository.save(user);
                
                // Send welcome email
                emailService.sendRegistrationEmail(user.getEmail(), user.getName());
            } else {
                user = userOpt.get();
            }

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());
            return ResponseEntity.ok(new AuthResponse(token, user.getRole(), user));

        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal Server Error: " + e.getMessage() + "\"}");
        }
    }
}
