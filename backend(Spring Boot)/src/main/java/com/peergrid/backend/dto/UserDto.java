package com.peergrid.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class UserDto {
    private Integer id;
    private String name;
    private String email;
    private String role;
    private String bio;
    private String profilePictureUrl;
    private List<String> skillsOffered;
    private List<String> skillsNeeded;
    private BigDecimal gridPoints;
    private BigDecimal lockedPoints;
    private boolean isAvailable;
    
    private int totalSessions;
    private double hoursTaught;
    private double averageRating;
    private List<SessionDto> recentSessions;
    private List<String> badges;
}
