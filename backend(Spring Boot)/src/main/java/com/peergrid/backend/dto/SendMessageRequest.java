package com.peergrid.backend.dto;

import lombok.Data;

@Data
public class SendMessageRequest {
    private Integer receiverId;
    private String content;
}
