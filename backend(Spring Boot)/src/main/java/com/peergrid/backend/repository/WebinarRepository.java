package com.peergrid.backend.repository;

import com.peergrid.backend.entity.Webinar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WebinarRepository extends JpaRepository<Webinar, Integer> {
    List<Webinar> findByScheduledTimeAfterOrderByScheduledTimeAsc(LocalDateTime now);
}
