package com.peergrid.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateDoubtRequest {
    private String title;
    private String description;
    private String topic;
    private BigDecimal bounty;
}
