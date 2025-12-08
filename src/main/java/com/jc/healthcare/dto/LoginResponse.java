package com.jc.healthcare.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class LoginResponse {
    private String status;          // "success" | "otp_required" | "error"
    private String email;
    private List<String> roles;     // e.g., ["admin", "doctor"]
    private boolean requiresOtp;
    private String message;         // human-readable
}
