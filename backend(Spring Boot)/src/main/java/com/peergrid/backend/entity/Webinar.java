package com.peergrid.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "webinars")
public class Webinar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;
    
    @Column(length = 1000)
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "host_id")
    private User host;

    private LocalDateTime scheduledTime;
    private Integer durationMinutes;
    private BigDecimal cost;
    private String meetingLink;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "webinar_attendees", joinColumns = @JoinColumn(name = "webinar_id"))
    @Column(name = "user_id")
    private Set<Integer> registeredUserIds = new HashSet<>();
}
