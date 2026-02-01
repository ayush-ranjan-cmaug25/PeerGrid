package com.peergrid.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name = "";
    private String email = "";
    private String passwordHash = "";
    private String role = "User"; // Admin, User
    private String bio = "";
    private String profilePictureUrl = "";

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> skillsOffered = new java.util.ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> skillsNeeded = new java.util.ArrayList<>();

    private BigDecimal gridPoints = BigDecimal.ZERO;
    private BigDecimal lockedPoints = BigDecimal.ZERO;
    
    private boolean isAvailable = true;
    private boolean banned = false;
}
