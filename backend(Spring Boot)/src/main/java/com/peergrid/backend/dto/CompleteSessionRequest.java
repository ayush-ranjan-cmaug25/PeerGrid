package com.peergrid.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CompleteSessionRequest {
    private Integer learnerId;
    private Integer tutorId;
    private BigDecimal cost;
}
