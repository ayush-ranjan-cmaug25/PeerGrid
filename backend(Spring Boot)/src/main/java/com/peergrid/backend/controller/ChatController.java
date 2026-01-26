package com.peergrid.backend.controller;

import com.peergrid.backend.dto.SendMessageRequest;
import com.peergrid.backend.entity.Message;
import com.peergrid.backend.entity.User;
import com.peergrid.backend.repository.MessageRepository;
import com.peergrid.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<Map<String, Object>>> getConversations() {
        User user = getAuthenticatedUser();
        Integer userId = user.getId();

        List<Message> messages = messageRepository.findAll().stream()
                .filter(m -> m.getSender().getId().equals(userId) || m.getReceiver().getId().equals(userId))
                .sorted((m1, m2) -> m2.getTimestamp().compareTo(m1.getTimestamp()))
                .collect(Collectors.toList());

        Map<Integer, Message> latestMessages = new LinkedHashMap<>();
        for (Message m : messages) {
            Integer otherId = m.getSender().getId().equals(userId) ? m.getReceiver().getId() : m.getSender().getId();
            latestMessages.putIfAbsent(otherId, m);
        }

        List<Map<String, Object>> conversations = new ArrayList<>();
        for (Map.Entry<Integer, Message> entry : latestMessages.entrySet()) {
            Message m = entry.getValue();
            User otherUser = m.getSender().getId().equals(userId) ? m.getReceiver() : m.getSender();
            
            Map<String, Object> map = new HashMap<>();
            map.put("id", otherUser.getId());
            map.put("name", otherUser.getName());
            
            String initials = Arrays.stream(otherUser.getName().split(" "))
                    .map(n -> n.substring(0, 1))
                    .collect(Collectors.joining());
            map.put("avatar", initials);
            
            map.put("lastMessage", m.getContent());
            map.put("time", m.getTimestamp().format(DateTimeFormatter.ofPattern("h:mm a")));
            map.put("online", false);
            
            conversations.add(map);
        }

        return ResponseEntity.ok(conversations);
    }

    @GetMapping("/messages/{otherUserId}")
    public ResponseEntity<List<Map<String, Object>>> getMessages(@PathVariable Integer otherUserId) {
        User user = getAuthenticatedUser();
        Integer userId = user.getId();

        List<Map<String, Object>> messages = messageRepository.findAll().stream()
                .filter(m -> (m.getSender().getId().equals(userId) && m.getReceiver().getId().equals(otherUserId)) ||
                             (m.getSender().getId().equals(otherUserId) && m.getReceiver().getId().equals(userId)))
                .sorted(Comparator.comparing(Message::getTimestamp))
                .map(m -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", m.getId());
                    map.put("sender", m.getSender().getId().equals(userId) ? "me" : "them");
                    map.put("text", m.getContent());
                    map.put("time", m.getTimestamp().format(DateTimeFormatter.ofPattern("h:mm a")));
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(messages);
    }

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendMessage(@RequestBody SendMessageRequest request) {
        if (request.getReceiverId() == null) throw new RuntimeException("Receiver ID is required");
        User user = getAuthenticatedUser();
        User receiver = userRepository.findById(Objects.requireNonNull(request.getReceiverId())).orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message();
        message.setSender(user);
        message.setReceiver(receiver);
        message.setContent(request.getContent());
        message.setTimestamp(LocalDateTime.now());
        
        messageRepository.save(message);

        messageRepository.save(message);
        Map<String, Object> wsMessage = new HashMap<>();
        wsMessage.put("id", message.getId());
        wsMessage.put("sender", "them");
        wsMessage.put("text", message.getContent());
        wsMessage.put("time", message.getTimestamp().format(DateTimeFormatter.ofPattern("h:mm a")));
        wsMessage.put("senderId", user.getId());

        wsMessage.put("senderId", user.getId());
        if (receiver.getEmail() != null) {
            messagingTemplate.convertAndSendToUser(
                    Objects.requireNonNull(receiver.getEmail()),
                    "/queue/messages",
                    wsMessage
            );
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", message.getId());
        response.put("sender", "me");
        response.put("text", message.getContent());
        if (message.getTimestamp() != null) {
            response.put("time", message.getTimestamp().format(DateTimeFormatter.ofPattern("h:mm a")));
        } else {
            response.put("time", "");
        }

        return ResponseEntity.ok(response);
    }
}
