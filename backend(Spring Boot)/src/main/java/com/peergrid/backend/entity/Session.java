package com.peergrid.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "sessions")
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private User tutor;

    @ManyToOne
    @JoinColumn(name = "learner_id")
    private User learner;

    private String title = "";
    private String description = "";
    private String topic = "";

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status = "Pending"; // Open, Pending, Active, Completed, Cancelled
    private BigDecimal cost;
}
