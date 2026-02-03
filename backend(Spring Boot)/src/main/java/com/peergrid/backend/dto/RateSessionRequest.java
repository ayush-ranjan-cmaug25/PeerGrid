package com.peergrid.backend.dto;

import lombok.Data;

@Data
public class RateSessionRequest {
    private Integer transactionId;
    private Integer sessionId;
    private Double rating;
    private String comment;
}
