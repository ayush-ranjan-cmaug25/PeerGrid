package com.peergrid.backend.dto;

import lombok.Data;

@Data
public class RateSessionRequest {
    private Integer transactionId;
    private Double rating;
}
