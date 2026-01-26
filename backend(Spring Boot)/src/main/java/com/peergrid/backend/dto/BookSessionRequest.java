package com.peergrid.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class BookSessionRequest {
    private Integer learnerId;
    private Integer tutorId;
    private BigDecimal cost;
    private String topic;
    private LocalDateTime startTime;
}
