package com.jc.healthcare.controller;

import com.jc.healthcare.model.Patient;
import com.jc.healthcare.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/patient")
@CrossOrigin(origins = "http://localhost:3000")
public class PatientController {

    @Autowired
    private PatientService patientService;

    // ➕ Add New Patient
    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addPatient(@RequestBody Patient patient) {
        Map<String, Object> response = new HashMap<>();
        try {
        	if (patient.getAppointmentDate() == null) {
        	    patient.setAppointmentDate(java.time.LocalDate.now().toString());
        	}
        	if (patient.getAppointmentTime() == null) {
        	    patient.setAppointmentTime(java.time.LocalTime.now().toString());
        	}

            Patient savedPatient = patientService.addPatient(patient);
            response.put("success", true);
            response.put("data", savedPatient);
            response.put("message", "Patient added successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error adding patient: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // 📋 Get All Patients
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPatients() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Patient> patients = patientService.getAllPatients();
            response.put("success", true);
            response.put("data", patients);
            response.put("message", "Patients retrieved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error retrieving patients: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 🔍 Get Patient by ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPatientById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Patient patient = patientService.getPatientById(id)
                    .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + id));
            response.put("success", true);
            response.put("data", patient);
            response.put("message", "Patient retrieved successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // ✏️ Update Patient
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updatePatient(@PathVariable Long id, @RequestBody Patient updatedPatient) {
        Map<String, Object> response = new HashMap<>();
        try {
            Patient patient = patientService.updatePatient(id, updatedPatient);
            response.put("success", true);
            response.put("data", patient);
            response.put("message", "Patient updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error updating patient: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // ❌ Delete Patient
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePatient(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            patientService.deletePatient(id);
            response.put("success", true);
            response.put("message", "Patient deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    @GetMapping("/count")
    public long getDoctorCount() {
        return patientService.Count();
    }
 // 🔍 Filter by Medicine Status
    @GetMapping("/filter/medicine/{status}")
    public ResponseEntity<Map<String, Object>> getPatientsByMedisionStatus(@PathVariable String status) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Patient> patients = patientService.getByMedisionStatus(status);
            response.put("success", true);
            response.put("data", patients);
            response.put("message", "Patients filtered by MEDISION_STATUS: " + status);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 🔍 Filter by Doctor Status
    @GetMapping("/filter/doctor/{status}")
    public ResponseEntity<Map<String, Object>> getPatientsByDoctorStatus(@PathVariable String status) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Patient> patients = patientService.getByDoctorStatus(status);
            response.put("success", true);
            response.put("data", patients);
            response.put("message", "Patients filtered by DOCTOR_STATUS: " + status);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 🔍 Filter by Lab Status
    @GetMapping("/filter/lab/{status}")
    public ResponseEntity<Map<String, Object>> getPatientsByLabStatus(@PathVariable String status) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Patient> patients = patientService.getByLabStatus(status);
            response.put("success", true);
            response.put("data", patients);
            response.put("message", "Patients filtered by LAB_STATUS: " + status);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    @GetMapping("/filter/native")
    public ResponseEntity<Map<String, Object>> filterPatientsNative(
            @RequestParam("fromDate") String fromDate,
            @RequestParam(value = "medisionStatus", required = false) String medisionStatus,
            @RequestParam(value = "doctorStatus", required = false) String doctorStatus,
            @RequestParam(value = "doctorId", required = false) Long doctorId
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 🔸 Validate date input
            if (fromDate == null || fromDate.trim().isEmpty()) {
                throw new IllegalArgumentException("❌ 'fromDate' cannot be empty");
            }

            String cleanDate = fromDate.trim();
            if (!cleanDate.matches("\\d{4}-\\d{2}-\\d{2}")) {
                throw new IllegalArgumentException("❌ fromDate must be in format YYYY-MM-DD, received: " + cleanDate);
            }

            // 🔸 Fetch filtered results
            List<Patient> patients = patientService.getFilteredPatientsNative(cleanDate, medisionStatus, doctorStatus, doctorId);

            response.put("success", true);
            response.put("count", patients.size());
            response.put("data", patients);
            response.put("message", "✅ Filtered patient data fetched successfully");
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "❌ Error while fetching data: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> patchUpdatePatient(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        
        Map<String, Object> response = new HashMap<>();
        try {
            Patient updatedPatient = patientService.partialUpdatePatient(id, updates);
            response.put("success", true);
            response.put("data", updatedPatient);
            response.put("message", "Patient details updated successfully (partial update)");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error updating patient details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/full-details/{patientId}")
    public ResponseEntity<Map<String, Object>> getFullPatientDetails(@PathVariable Long patientId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> data = patientService.getFullPatientDetails(patientId);
            response.put("success", true);
            response.put("data", data);
            response.put("message", "Full patient details fetched successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching full details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }



}
