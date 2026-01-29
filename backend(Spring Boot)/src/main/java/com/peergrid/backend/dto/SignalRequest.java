package com.peergrid.backend.dto;

import lombok.Data;

@Data
public class SignalRequest {
    private String targetUserId;
    private String signalData; // JSON string of the signal (SDP or ICE candidate)
    private String type; // "offer", "answer", "candidate"
}
