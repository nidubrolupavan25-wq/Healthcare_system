package com.jc.healthcare.service;

import com.jc.healthcare.dto.LoginResponse;
import com.jc.healthcare.model.Doctor;
import com.jc.healthcare.model.Staff;
import com.jc.healthcare.repository.DoctorRepository;
import com.jc.healthcare.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private JavaMailSender mailSender;

    // Generic OTP store (works for any valid email)
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();
    private final Map<String, Long> otpTimestamps = new ConcurrentHashMap<>();

    public LoginResponse login(String email, String password) {
        List<String> roles = new ArrayList<>();
        boolean staffMatched = false;
        boolean doctorMatched = false;

        // 1) check Staff
        Staff staff = staffRepository.findByEmail(email);
        if (staff != null && Objects.equals(staff.getPassword(), password)) {
            staffMatched = true;
            if (staff.getRole() != null && !staff.getRole().isBlank()) {
                roles.add(staff.getRole().toLowerCase()); // e.g., "admin", "medical"
            }
        }

        // 2) check Doctor
        Optional<Doctor> docOpt = doctorRepository.findByEmail(email);
        if (docOpt.isPresent()) {
            Doctor doctor = docOpt.get();
            if (Objects.equals(doctor.getPassword(), password)) {
                doctorMatched = true;
                roles.add("doctor");
            }
        }

        if (!staffMatched && !doctorMatched) {
            return LoginResponse.builder()
                    .status("error")
                    .message("Invalid email or password")
                    .email(email)
                    .roles(Collections.emptyList())
                    .requiresOtp(false)
                    .build();
        }

        // 3) Determine if OTP is required
        // Rule: if a matching Staff login exists AND staff.twoFactorAuthentication == 0 -> require OTP
        boolean requiresOtp = false;
        if (staffMatched && staff != null) {
            Integer tfa = staff.getTwoFactAuthentication(); // 0 means enabled per your code
            requiresOtp = (tfa != null && tfa == 0);
        }

        if (requiresOtp) {
            // Send OTP to email (works for staff-only, doctor-only, or both)
            String otp = generateOtp();
            sendOtpEmail(email, otp);
            otpStore.put(email, otp);
            otpTimestamps.put(email, System.currentTimeMillis());

            return LoginResponse.builder()
                    .status("otp_required")
                    .email(email)
                    .roles(roles)
                    .requiresOtp(true)
                    .message("OTP sent to your registered email")
                    .build();
        }

        // 4) No OTP required -> success
        return LoginResponse.builder()
                .status("success")
                .email(email)
                .roles(roles)
                .requiresOtp(false)
                .message(roles.size() > 1 ? "Multiple roles found" : "Login successful")
                .build();
    }

    public LoginResponse verifyOtp(String email, String enteredOtp) {
        String storedOtp = otpStore.get(email);
        Long createdAt = otpTimestamps.get(email);
        if (storedOtp == null || createdAt == null) {
            return LoginResponse.builder()
                    .status("error")
                    .email(email)
                    .roles(Collections.emptyList())
                    .requiresOtp(true)
                    .message("OTP not generated or expired")
                    .build();
        }

        long elapsedMs = System.currentTimeMillis() - createdAt;
        if (elapsedMs > 120_000) { // 2 minutes
            otpStore.remove(email);
            otpTimestamps.remove(email);
            return LoginResponse.builder()
                    .status("error")
                    .email(email)
                    .roles(Collections.emptyList())
                    .requiresOtp(true)
                    .message("OTP expired. Please login again.")
                    .build();
        }

        if (!storedOtp.equals(enteredOtp)) {
            return LoginResponse.builder()
                    .status("error")
                    .email(email)
                    .roles(Collections.emptyList())
                    .requiresOtp(true)
                    .message("Invalid OTP")
                    .build();
        }

        // OTP OK -> clear it and return roles for this email
        otpStore.remove(email);
        otpTimestamps.remove(email);

        List<String> roles = new ArrayList<>();

        Staff staff = staffRepository.findByEmail(email);
        if (staff != null && staff.getRole() != null) {
            roles.add(staff.getRole().toLowerCase());
        }

        doctorRepository.findByEmail(email).ifPresent(d -> roles.add("doctor"));

        return LoginResponse.builder()
                .status("success")
                .email(email)
                .roles(roles)
                .requiresOtp(false)
                .message(roles.size() > 1 ? "Multiple roles found" : "Login successful")
                .build();
    }

    private String generateOtp() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }

    private void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your Login OTP - JC Healthcare");
        message.setText("Your OTP is: " + otp + "\n\nThis OTP is valid for 2 minutes.\n\n- JC Healthcare Team");
        mailSender.send(message);
    }
}
