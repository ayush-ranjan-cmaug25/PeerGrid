package com.peergrid.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaymentVerificationRequest {
    private String orderId;
    private String paymentId;
    private String signature;
    private BigDecimal amount;
}
