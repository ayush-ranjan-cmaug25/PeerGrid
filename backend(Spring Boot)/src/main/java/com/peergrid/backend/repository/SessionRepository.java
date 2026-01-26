package com.peergrid.backend.repository;

import com.peergrid.backend.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SessionRepository extends JpaRepository<Session, Integer> {
    List<Session> findByTutorId(Integer tutorId);
    List<Session> findByLearnerId(Integer learnerId);
}
