package com.jc.healthcare.service;

import com.jc.healthcare.model.Staff;
import com.jc.healthcare.repository.DoctorRepository;
import com.jc.healthcare.model.Doctor;

import com.jc.healthcare.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class StaffService {

    @Autowired
    private StaffRepository staffRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    


    @Autowired
    private JavaMailSender mailSender;

    // ✅ Store OTPs temporarily in memory (email → otp)
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();
    private final Map<String, Long> otpTimestamps = new ConcurrentHashMap<>();

    // =========================
    // 🧩 CRUD & IMAGE METHODS
    // =========================

    // 1️⃣ Fetch all staff
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    // 2️⃣ Fetch by department
    public List<Staff> getStaffByDepartment(String department) {
        return staffRepository.findByDepartmentIgnoreCase(department);
    }

    // 3️⃣ Add new staff (with password)
    public Staff addNewStaff(Staff staff) {
        if (staff.getAdhar() != null && staffRepository.existsByAdhar(staff.getAdhar())) {
            throw new IllegalArgumentException("Aadhar number already exists: " + staff.getAdhar());
        }
        staff.setLoginAttempts(0);
        return staffRepository.save(staff);
    }

    // 4️⃣ Delete staff
    public boolean deleteStaff(Long id) {
        if (staffRepository.existsById(id)) {
            staffRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // 5️⃣ Update staff details
    public Staff updateStaff(Long id, Staff updatedStaff) {
        return staffRepository.findById(id)
                .map(existing -> {
                    existing.setName(updatedStaff.getName());
                    existing.setMobile(updatedStaff.getMobile());
                    existing.setEmail(updatedStaff.getEmail());
                    existing.setAdhar(updatedStaff.getAdhar());
                    existing.setAddress(updatedStaff.getAddress());
                    existing.setDepartment(updatedStaff.getDepartment());
                    existing.setRole(updatedStaff.getRole());
                    existing.setSalary(updatedStaff.getSalary());
                    existing.setJoiningDate(updatedStaff.getJoiningDate());
                    existing.setTimings(updatedStaff.getTimings());
                    existing.setPassword(updatedStaff.getPassword());
                    return staffRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Staff not found with ID " + id));
    }

    // 6️⃣ Upload image
    public void uploadStaffImage(Long id, MultipartFile file) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found with ID " + id));
        try {
            staff.setImage(file.getBytes());
            staffRepository.save(staff);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    // 7️⃣ Update image
    public void updateStaffImage(Long id, MultipartFile file) {
        uploadStaffImage(id, file);
    }

    // 8️⃣ Fetch image
    public byte[] getStaffImage(Long id) {
        return staffRepository.findById(id)
                .map(Staff::getImage)
                .orElse(null);
    }

    // =========================
    // 🔐 LOGIN + OTP METHODS
    // =========================

    public String verifyLogin(String email, String password) {
        Staff staff = staffRepository.findByEmail(email);
        if (staff == null) {
            return "Invalid Email";
        }

        if (staff.getLoginAttempts() >= 4) {
            return "Account Locked. Contact Admin.";
        }

        if (!staff.getPassword().equals(password)) {
            staff.setLoginAttempts(staff.getLoginAttempts() + 1);
            staffRepository.save(staff);
            return "Invalid Password. Attempt " + staff.getLoginAttempts();
        }

        // ✅ Reset failed attempts
        staff.setLoginAttempts(0);
        staffRepository.save(staff);

        // ✅ Generate OTP and send email
        String otp = generateOtp();
        sendOtpEmail(staff.getEmail(), otp);

        // ✅ Save OTP in memory with timestamp
        otpStore.put(email, otp);
        otpTimestamps.put(email, System.currentTimeMillis());

        return "OTP Sent to your registered email";
    }
   

    public String verifyOtp(String email, String enteredOtp) {
        Staff staff = staffRepository.findByEmail(email);
        if (staff == null) return "User not found";

        String storedOtp = otpStore.get(email);
        Long createdAt = otpTimestamps.get(email);

        if (storedOtp == null || createdAt == null) {
            return "OTP not generated or expired. Please login again.";
        }

        // ✅ Check OTP expiry (2 minutes = 120000 ms)
        long elapsed = System.currentTimeMillis() - createdAt;
        if (elapsed > 120000) { // 2 minutes
            otpStore.remove(email);
            otpTimestamps.remove(email);
            return "OTP expired. Please request a new one.";
        }

        // ✅ Match OTP
        if (storedOtp.equals(enteredOtp)) {
            otpStore.remove(email);
            otpTimestamps.remove(email);
            return "Login Successful";
        }

        return "Invalid OTP. Please try again.";
    }

    // =========================
    // ✉️ EMAIL + OTP GENERATION
    // =========================

    private String generateOtp() {
        return String.valueOf(100000 + new Random().nextInt(900000)); // 6-digit random OTP
    }

    private void sendOtpEmail(String to, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Your Login OTP - JC Healthcare");
            message.setText("Your OTP is: " + otp + "\n\nThis OTP is valid for 2 minutes.\n\n- JC Healthcare Team");
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }
 // 🔹 Get staff details by email
    public Staff getStaffByEmail(String email) {
        Staff staff = staffRepository.findByEmail(email);
        if (staff == null) {
            throw new RuntimeException("Staff not found with email: " + email);
        }
        return staff;
    }
   
    public void deleteStaffImage(Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found with ID " + id));

        if (staff.getImage() == null) {
            throw new RuntimeException("No image found for staff ID: " + id);
        }

        staff.setImage(null); // Remove image
        staffRepository.save(staff);
    }
    public Staff updateStaffFieldsByEmail(String email, Map<String, Object> updates) {
        Staff staff = staffRepository.findByEmail(email);
        if (staff == null) {
            throw new RuntimeException("Staff not found with email: " + email);
        }

        updates.forEach((key, value) -> {
            switch (key) {
                case "name" -> staff.setName((String) value);
                case "mobile" -> staff.setMobile((String) value);
                case "adhar" -> staff.setAdhar((String) value);
                case "address" -> staff.setAddress((String) value);
                case "department" -> staff.setDepartment((String) value);
                case "role" -> staff.setRole((String) value);
                case "salary" -> staff.setSalary(Double.valueOf(value.toString()));
                case "timings" -> staff.setTimings((String) value);
                case "password" -> staff.setPassword((String) value);
                case "twoFactorAuthentication" -> staff.setTwoFactAuthentication(Integer.valueOf(value.toString()));
            }
        });

        return staffRepository.save(staff);
    }
    public Staff updateStaffFieldsById(Long id, Map<String, Object> updates) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found with ID: " + id));

        if (updates.containsKey("name")) {
            staff.setName((String) updates.get("name"));
        }
        if (updates.containsKey("mobile")) {
            staff.setMobile((String) updates.get("mobile"));
        }
        if (updates.containsKey("adhar")) {
            staff.setAdhar((String) updates.get("adhar"));
        }
        if (updates.containsKey("address")) {
            staff.setAddress((String) updates.get("address"));
        }
        if (updates.containsKey("department")) {
            staff.setDepartment((String) updates.get("department"));
        }
        if (updates.containsKey("role")) {
            staff.setRole((String) updates.get("role"));
        }
        if (updates.containsKey("salary")) {
            staff.setSalary(Double.valueOf(updates.get("salary").toString()));
        }
        if (updates.containsKey("timings")) {
            staff.setTimings((String) updates.get("timings"));
        }
        if (updates.containsKey("password")) {
            staff.setPassword((String) updates.get("password"));
        }
        if (updates.containsKey("twoFactorAuthentication")) {
            Object value = updates.get("twoFactorAuthentication");
            if (value instanceof Number) {
                staff.setTwoFactAuthentication(((Number) value).intValue());
            } else if (value != null) {
                staff.setTwoFactAuthentication(Integer.parseInt(value.toString()));
            }
        }

        return staffRepository.save(staff);
    }
 // =========================
 // ✉️ SEND OTP WITHOUT LOGIN
 // =========================
 // ✅ Check both staff and doctor tables when sending OTP (Forgot Password)
    public String sendOtpToEmail(String email) {
        boolean userFound = false;

        // 1️⃣ Check in staff table
        Staff staff = staffRepository.findByEmail(email);
        if (staff != null) {
            userFound = true;
        }

        // 2️⃣ Check in doctor table if not found in staff
        if (!userFound && doctorRepository.findByEmail(email).isPresent()) {
            userFound = true;
        }

        // 3️⃣ If user not found in both
        if (!userFound) {
            throw new RuntimeException("No user found with email: " + email);
        }

        // 4️⃣ Generate and send OTP
        String otp = generateOtp();
        sendOtpEmail(email, otp);

        otpStore.put(email, otp);
        otpTimestamps.put(email, System.currentTimeMillis());

        return "OTP sent successfully to " + email;
    }

    

    public void updatePasswordForAllRoles(String email, String newPassword) {
        boolean updated = false;

        // Check Staff table
        Staff staff = staffRepository.findByEmail(email);
        if (staff != null) {
            staff.setPassword(newPassword);
            staffRepository.save(staff);
            updated = true;
        }

        // Check Doctor table
        Optional<Doctor> doctorOpt = doctorRepository.findByEmail(email);
        if (doctorOpt.isPresent()) {
            Doctor doctor = doctorOpt.get();
            doctor.setPassword(newPassword);
            doctorRepository.save(doctor);
            updated = true;
        }

        // Handle not found case
        if (!updated) {
            throw new RuntimeException("No user found with email: " + email);
        }
    }

}





