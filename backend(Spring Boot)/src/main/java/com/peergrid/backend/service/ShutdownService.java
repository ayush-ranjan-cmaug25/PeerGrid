package com.peergrid.backend.service;

import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ShutdownService implements ApplicationListener<ContextClosedEvent> {

    private final SimpMessagingTemplate messagingTemplate;

    public ShutdownService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void onApplicationEvent(ContextClosedEvent event) {
        System.out.println("Initiating Graceful Shutdown Broadcast...");
        try {
            // Broadcast shutdown message to all subscribers of /topic/status
            Map<String, String> message = new HashMap<>();
            message.put("type", "SHUTDOWN");
            message.put("content", "Server is shutting down");
            messagingTemplate.convertAndSend("/topic/status", message);
            System.out.println("Shutdown signal broadcasted to clients.");
            // Give a small delay to ensure message goes out before underlying transport closes
            Thread.sleep(500);
        } catch (Exception e) {
            System.err.println("Failed to broadcast shutdown message: " + e.getMessage());
        }
    }
}
