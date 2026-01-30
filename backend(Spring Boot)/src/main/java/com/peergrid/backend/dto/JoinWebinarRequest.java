package com.peergrid.backend.dto;

import lombok.Data;

@Data
public class JoinWebinarRequest {
    private String webinarId;
    private String userId;
    private String name;
    private String type; // "join", "leave", "offer", "answer", "candidate"
}
