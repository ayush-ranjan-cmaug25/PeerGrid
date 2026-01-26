package com.peergrid.backend.repository;

import com.peergrid.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findBySenderIdOrReceiverId(Integer senderId, Integer receiverId);
}
