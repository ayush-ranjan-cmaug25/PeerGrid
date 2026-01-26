package com.peergrid.backend.repository;

import com.peergrid.backend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    List<Feedback> findBySessionId(Integer sessionId);
}
