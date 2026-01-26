package com.peergrid.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "learner_id")
    private User learner;

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private User tutor;

    private String skill = "";
    private BigDecimal points;
    private String type = "Transfer"; // Earned, Spent, Transfer
    private LocalDateTime timestamp;

    private Double rating; // 1-5 stars
}
