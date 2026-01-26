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
    
    // For Dashboard
    private String title;
    private String description;
    private BigDecimal points;
    private String[] tags;
}
