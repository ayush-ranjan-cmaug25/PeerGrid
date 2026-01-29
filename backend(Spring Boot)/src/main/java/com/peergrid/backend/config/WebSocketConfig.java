package com.peergrid.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.lang.NonNull;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private com.peergrid.backend.security.JwtUtil jwtUtil;

    @Autowired
    private org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @Override
    public void configureMessageBroker(@NonNull MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(org.springframework.messaging.simp.config.ChannelRegistration registration) {
        registration.interceptors(new org.springframework.messaging.support.ChannelInterceptor() {
            @Override
            public org.springframework.messaging.Message<?> preSend(org.springframework.messaging.Message<?> message, org.springframework.messaging.MessageChannel channel) {
                org.springframework.messaging.simp.stomp.StompHeaderAccessor accessor =
                        org.springframework.messaging.support.MessageHeaderAccessor.getAccessor(message, org.springframework.messaging.simp.stomp.StompHeaderAccessor.class);

                if (accessor == null) {
                    return message;
                }

                if (org.springframework.messaging.simp.stomp.StompCommand.CONNECT.equals(accessor.getCommand())) {
                    System.out.println("STOMP Connect Request Received");
                    String authorizationHeader = accessor.getFirstNativeHeader("Authorization");
                    System.out.println("Authorization Header: " + authorizationHeader);

                    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                        String jwt = authorizationHeader.substring(7);
                        try {
                            String username = jwtUtil.extractUsername(jwt);
                            System.out.println("Extracted Username: " + username);
                            if (username != null) {
                                org.springframework.security.core.userdetails.UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                                if (jwtUtil.validateToken(jwt, userDetails.getUsername())) {
                                    org.springframework.security.authentication.UsernamePasswordAuthenticationToken authentication =
                                            new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                                                    userDetails, null, userDetails.getAuthorities());
                                    accessor.setUser(authentication);
                                    System.out.println("User Authenticated and Set: " + username);
                                } else {
                                    System.out.println("Token validation failed");
                                }
                            }
                        } catch (Exception e) {
                            System.out.println("Token processing error: " + e.getMessage());
                            e.printStackTrace();
                        }
                    } else {
                        System.out.println("No valid Authorization header found");
                    }
                } else if (org.springframework.messaging.simp.stomp.StompCommand.SEND.equals(accessor.getCommand())) {
                    System.out.println("STOMP SEND Received. User: " + accessor.getUser());
                    if (accessor.getUser() == null) {
                        System.out.println("WARNING: User is null on SEND frame!");
                    }
                }
                return message;
            }
        });
    }
}
