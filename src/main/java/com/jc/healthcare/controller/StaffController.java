package com.jc.healthcare.controller;
import com.jc.healthcare.model.Staff; 
import com.jc.healthcare.service.StaffService; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List; 
import java.util.Map;
@RestController
@RequestMapping("/api/staff")
@CrossOrigin("*")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @GetMapping
    public List<Staff> getAllStaff() {
        return staffService.getAllStaff();
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Staff> getStaffByEmail(@PathVariable String email) {
        try {
            Staff staff = staffService.getStaffByEmail(email);
            return ResponseEntity.ok(staff);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


    
    @GetMapping("/department/{department}")
    public List<Staff> getStaffByDepartment(@PathVariable String department) {
        return staffService.getStaffByDepartment(department);
    }

   
    @PostMapping
    public Staff addStaff(@RequestBody Staff staff) {
        return staffService.addNewStaff(staff);
    }

 
    @DeleteMapping("/{id}")
    public String deleteStaff(@PathVariable Long id) {
        boolean deleted = staffService.deleteStaff(id);
        return deleted ? "Staff deleted successfully" : "Staff not found";
    }

  
    @PutMapping("/{id}")
    public Staff updateStaff(@PathVariable Long id, @RequestBody Staff updatedStaff) {
        return staffService.updateStaff(id, updatedStaff);
    }

 
    @PostMapping("/{id}/upload-image")
    public ResponseEntity<String> uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        staffService.uploadStaffImage(id, file);
        return ResponseEntity.ok("Image uploaded successfully for staff ID: " + id);
    }

   
    @PutMapping("/{id}/update-image")
    public ResponseEntity<String> updateImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        staffService.updateStaffImage(id, file);
        return ResponseEntity.ok("Image updated successfully for staff ID: " + id);
    }

 
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getStaffImage(@PathVariable Long id) {
        byte[] image = staffService.getStaffImage(id);
        if (image == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE)
                .body(image);
    }
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String result = staffService.verifyLogin(email, password);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");
        String result = staffService.verifyOtp(email, otp);
        return ResponseEntity.ok(result);
    }
    
   
    @PatchMapping("/email/{email}")
    public ResponseEntity<String> patchStaffByEmail(
            @PathVariable String email,
            @RequestBody Map<String, Object> updates) {
        try {
            Staff updatedStaff = staffService.updateStaffFieldsByEmail(email, updates);
            return ResponseEntity.ok("Staff updated successfully for email: " + updatedStaff.getEmail());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PatchMapping("/{id}")
    public ResponseEntity<String> updateStaffById(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        try {
            Staff updatedStaff = staffService.updateStaffFieldsById(id, updates);
            return ResponseEntity.ok("Staff updated successfully for ID: " + updatedStaff.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        try {
            String response = staffService.sendOtpToEmail(email);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


 // ✅ Update password for both staff_master and doctor if email exists
    @PutMapping("/password/update")

    public ResponseEntity<String> updatePassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String newPassword = body.get("password");

        if (email == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        try {
            staffService.updatePasswordForAllRoles(email, newPassword);
            return ResponseEntity.ok("Password updated successfully for " + email);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    }
