package com.peergrid.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
public class SessionDto {
    private Integer id;
    private String topic;
    private String otherParty;
    private LocalDateTime time;
    private String status;
    private Integer otherPartyId;
    private Integer tutorId;
    private Integer learnerId;
    
    // For Dashboard
    private String title;
    private String description;
    private BigDecimal points;
    private BigDecimal cost;
    private String[] tags;
}
