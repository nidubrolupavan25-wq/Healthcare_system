package com.jc.healthcare.controller;

import com.jc.healthcare.dto.LoginRequest;
import com.jc.healthcare.dto.LoginResponse;
import com.jc.healthcare.dto.OtpVerifyRequest;
import com.jc.healthcare.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        LoginResponse resp = authService.login(req.getEmail(), req.getPassword());
        if ("error".equalsIgnoreCase(resp.getStatus())) {
            return ResponseEntity.status(401).body(resp);
        }
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<LoginResponse> verifyOtp(@RequestBody OtpVerifyRequest req) {
        LoginResponse resp = authService.verifyOtp(req.getEmail(), req.getOtp());
        if ("error".equalsIgnoreCase(resp.getStatus())) {
            return ResponseEntity.status(400).body(resp);
        }
        return ResponseEntity.ok(resp);
    }
}
