package com.peergrid.backend.controller;

import com.peergrid.backend.dto.SignalRequest;
import com.peergrid.backend.entity.User;
import com.peergrid.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Controller
public class VideoController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserRepository userRepository;

    @MessageMapping("/video/signal")
    public void handleSignal(@Payload SignalRequest request, Principal principal) {
        if (principal == null) {
            System.err.println("Error: Principal is null in handleSignal. Authentication failed for signal: " + request.getType());
            return;
        }
        String senderEmail = principal.getName();
        Optional<User> senderOpt = userRepository.findByEmail(senderEmail);
        
        if (senderOpt.isEmpty()) return;
        
        Integer senderId = senderOpt.get().getId();

        // Find target user to get their email (username for STOMP user destination)
        // Assuming targetUserId in request is the ID as string
        try {
            Integer targetId = Integer.parseInt(request.getTargetUserId());
            Optional<User> targetOpt = userRepository.findById(targetId);
            
            if (targetOpt.isPresent()) {
                User target = targetOpt.get();
                
                Map<String, Object> signalMessage = new HashMap<>();
                signalMessage.put("senderId", senderId.toString());
                signalMessage.put("signalData", request.getSignalData());
                signalMessage.put("type", request.getType());

                messagingTemplate.convertAndSendToUser(
                        target.getEmail(),
                        "/queue/video/signal",
                        signalMessage
                );
            }
        } catch (NumberFormatException e) {
            // Handle invalid ID
        }
    }
}
