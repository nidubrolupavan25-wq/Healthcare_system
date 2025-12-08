package com.jc.healthcare.controller;

import com.jc.healthcare.model.Doctor;
import com.jc.healthcare.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:3000")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllDoctors() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Map<String, Object>> doctorsList = doctorService.getAllDoctors().stream().map(doctor -> {
                Map<String, Object> d = new HashMap<>();
                d.put("doctorId", doctor.getDoctorId());
                d.put("doctorName", doctor.getDoctorName());
                d.put("specialization", doctor.getSpecialization());
                d.put("phone", doctor.getPhone());
                d.put("email", doctor.getEmail());
                d.put("experience", doctor.getExperience());
                d.put("status", doctor.getStatus());
                d.put("address", doctor.getAddress());
                d.put("dateOfBirth", doctor.getDateOfBirth());
                d.put("gender", doctor.getGender());
                d.put("city", doctor.getCity());
                d.put("state", doctor.getState());
                d.put("pinCode", doctor.getPinCode());
                d.put("country", doctor.getCountry());
                d.put("medicalLicenseNo", doctor.getMedicalLicenseNo());
                d.put("role", doctor.getRole());
                d.put("password", doctor.getPassword());

                if (doctor.getImage() != null)
                    d.put("image", java.util.Base64.getEncoder().encodeToString(doctor.getImage()));
                else
                    d.put("image", null);

                return d;
            }).toList();

            response.put("success", true);
            response.put("data", doctorsList);
            response.put("message", "Doctors retrieved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error retrieving doctors: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getDoctorById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Doctor doctor = doctorService.getDoctorById(id)
                    .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + id));

            // ✅ Convert image (byte[]) → Base64 string
            String base64Image = null;
            if (doctor.getImage() != null) {
                base64Image = java.util.Base64.getEncoder().encodeToString(doctor.getImage());
            }

            // ✅ Build a response map (manual)
            Map<String, Object> doctorData = new HashMap<>();
            doctorData.put("doctorId", doctor.getDoctorId());
            doctorData.put("doctorName", doctor.getDoctorName());
            doctorData.put("specialization", doctor.getSpecialization());
            doctorData.put("phone", doctor.getPhone());
            doctorData.put("email", doctor.getEmail());
            doctorData.put("experience", doctor.getExperience());
            doctorData.put("status", doctor.getStatus());
            doctorData.put("address", doctor.getAddress());
            doctorData.put("dateOfBirth", doctor.getDateOfBirth());
            doctorData.put("gender", doctor.getGender());
            doctorData.put("city", doctor.getCity());
            doctorData.put("state", doctor.getState());
            doctorData.put("pinCode", doctor.getPinCode());
            doctorData.put("country", doctor.getCountry());
            doctorData.put("medicalLicenseNo", doctor.getMedicalLicenseNo());
            doctorData.put("role", doctor.getRole());
            doctorData.put("password", doctor.getPassword());
            doctorData.put("image", base64Image); // ✅ include Base64 image here

            response.put("success", true);
            response.put("data", doctorData);
            response.put("message", "Doctor retrieved successfully");

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error retrieving doctor: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, Object>> createDoctor(
            @RequestParam Long doctorId, // <--- take ID from frontend
            @RequestParam String doctorName,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam String password,
            @RequestParam String specialization,
            @RequestParam String role,
            @RequestParam String status,
            @RequestParam String address,
            @RequestParam String dateOfBirth,  
            @RequestParam String gender,
            @RequestParam Integer experience,
            @RequestParam String medicalLicenseNo,
            @RequestParam(required = false) MultipartFile imageFile
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            Doctor doctor = new Doctor();

            // ✅ Set ID from frontend
            doctor.setDoctorId(doctorId);

            doctor.setDoctorName(doctorName);
            doctor.setEmail(email);
            doctor.setPhone(phone);
            doctor.setPassword(password);
            doctor.setSpecialization(specialization);
            doctor.setRole(role);
            doctor.setStatus(status);
            doctor.setAddress(address);
            doctor.setDateOfBirth(dateOfBirth);
            doctor.setGender(gender);
            doctor.setExperience(experience);
            doctor.setMedicalLicenseNo(medicalLicenseNo);

            // Store image as byte array
            if (imageFile != null && !imageFile.isEmpty()) {
                doctor.setImage(imageFile.getBytes());
            }

            Doctor savedDoctor = doctorService.createDoctor(doctor);
            response.put("success", true);
            response.put("data", savedDoctor);
            response.put("message", "Doctor created successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error creating doctor: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateDoctor(
            @PathVariable Long id,
            @RequestParam String doctorName,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam String password,
            @RequestParam String specialization,
            @RequestParam String role,
            @RequestParam String status,
            @RequestParam String address,
            @RequestParam String dateOfBirth,  // string
            @RequestParam String gender,
            @RequestParam Integer age,
            @RequestParam Integer experience,
            @RequestParam String medicalLicenseNo,
            @RequestParam(required = false) MultipartFile imageFile
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            Doctor doctor = new Doctor();
            
            doctor.setDoctorName(doctorName);
            doctor.setEmail(email);
            doctor.setPhone(phone);
            doctor.setPassword(password);
            doctor.setSpecialization(specialization);
            doctor.setRole(role);
            doctor.setStatus(status);
            doctor.setAddress(address);
            doctor.setDateOfBirth(dateOfBirth); // store string directly
            doctor.setGender(gender);
            
            doctor.setExperience(experience);
            doctor.setMedicalLicenseNo(medicalLicenseNo);

            if (imageFile != null && !imageFile.isEmpty()) {
                doctor.setImage(imageFile.getBytes());
            }

            Doctor updatedDoctor = doctorService.updateDoctor(id, doctor);
            response.put("success", true);
            response.put("data", updatedDoctor);
            response.put("message", "Doctor updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error updating doctor: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteDoctor(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            doctorService.deleteDoctor(id);
            response.put("success", true);
            response.put("message", "Doctor deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActiveDoctors() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Doctor> doctors = doctorService.getActiveDoctors();
            response.put("success", true);
            response.put("data", doctors);
            response.put("message", "Active doctors retrieved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error retrieving active doctors: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<Map<String, Object>> getDoctorsBySpecialization(@PathVariable String specialization) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Doctor> doctors = doctorService.getDoctorsBySpecialization(specialization);
            response.put("success", true);
            response.put("data", doctors);
            response.put("message", "Doctors retrieved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error retrieving doctors: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> changeDoctorStatus(@PathVariable Long id, @RequestBody Map<String, String> statusMap) {
        Map<String, Object> response = new HashMap<>();
        try {
            String status = statusMap.get("status");
            Doctor updatedDoctor = doctorService.changeDoctorStatus(id, status);
            response.put("success", true);
            response.put("data", updatedDoctor);
            response.put("message", "Doctor status updated successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    @GetMapping("/count")
    public long getDoctorCount() {
        return doctorService.Count();
    }
    @GetMapping("/email/{email}")
    public ResponseEntity<Map<String, Object>> getDoctorByEmail(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        try {
            Doctor doctor = doctorService.getDoctorByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Doctor not found with email: " + email));
            response.put("success", true);
            response.put("data", doctor);
            response.put("message", "Doctor retrieved successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> partiallyUpdateDoctor(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {

        Map<String, Object> response = new HashMap<>();

        try {
            Doctor updatedDoctor = doctorService.partiallyUpdateDoctor(id, updates);
            response.put("success", true);
            response.put("data", updatedDoctor);
            response.put("message", "Doctor details updated successfully");
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error updating doctor details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }


}
