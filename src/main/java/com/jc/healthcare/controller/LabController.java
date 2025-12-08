package com.jc.healthcare.controller;

import com.jc.healthcare.model.*;
import com.jc.healthcare.service.LabService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/labs")
@CrossOrigin(origins = "*")
public class LabController {

    @Autowired
    private LabService labService;

    // ========== CATEGORY CRUD ==========
    @GetMapping("/categories")
    public List<LabCategory> getAllCategories() {
        return labService.getAllCategories();
    }

    @PostMapping("/categories")
    public LabCategory addCategory(@RequestBody LabCategory category) {
        return labService.addCategory(category);
    }

    @PutMapping("/categories/{id}")
    public LabCategory updateCategory(@PathVariable Long id, @RequestBody LabCategory category) {
        return labService.updateCategory(id, category);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        labService.deleteCategory(id);
        return ResponseEntity.ok("Category deleted successfully");
    }

    // ========== TEST CRUD ==========
    @GetMapping("/tests")
    public List<LabTest> getAllTests() {
        return labService.getAllTests();
    }

    @PostMapping("/tests")
    public LabTest addTest(@RequestBody LabTest test) {
        return labService.addTest(test);
    }

    // ✅ PATCH for partial test update
    @PatchMapping("/tests/{id}")
    public ResponseEntity<LabTest> patchUpdateTest(@PathVariable Long id, @RequestBody LabTest test) {
        return ResponseEntity.ok(labService.patchUpdateTest(id, test));
    }

    @DeleteMapping("/tests/{id}")
    public ResponseEntity<String> deleteTest(@PathVariable Long id) {
        labService.deleteTest(id);
        return ResponseEntity.ok("Test deleted successfully");
    }

    // ========== REPORT CRUD ==========
    @PostMapping("/reports/upload/{patientId}/{testId}")
    public LabReport uploadReport(
            @PathVariable Long patientId,
            @PathVariable Long testId,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        return labService.uploadReport(patientId, testId, file);
    }

    @GetMapping("/reports/patient/{patientId}")
    public List<LabReport> getReportsByPatient(@PathVariable Long patientId) {
        return labService.getReportsByPatient(patientId);
    }

    @DeleteMapping("/reports/{reportId}")
    public ResponseEntity<String> deleteReport(@PathVariable Long reportId) {
        labService.deleteReport(reportId);
        return ResponseEntity.ok("Report deleted successfully");
    }

    // ✅ PATCH for updating report file only
    @PatchMapping("/reports/{reportId}/file")
    public ResponseEntity<LabReport> patchUpdateReportFile(
            @PathVariable Long reportId,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        return ResponseEntity.ok(labService.patchUpdateReportFile(reportId, file));
    }
 // ✅ LAB STATUS + PRESCRIPTION APIs
    @GetMapping("/status/urgent")
    public ResponseEntity<java.util.Map<String, Object>> getUrgentLabsWithPrescriptionToday() {
        return ResponseEntity.ok(labService.getUrgentLabsWithPrescriptionToday());
    }

    @GetMapping("/status/pending")
    public ResponseEntity<java.util.Map<String, Object>> getPendingLabsWithPrescriptionToday() {
        return ResponseEntity.ok(labService.getPendingLabsWithPrescriptionToday());
    }

    @GetMapping("/status/completed")
    public ResponseEntity<java.util.Map<String, Object>> getCompletedLabsWithPrescriptionToday() {
        return ResponseEntity.ok(labService.getCompletedLabsWithPrescriptionToday());
    }

    @GetMapping("/status/all")
    public ResponseEntity<java.util.Map<String, Object>> getAllLabsWithPrescriptionToday() {
        return ResponseEntity.ok(labService.getAllLabsWithPrescriptionToday());
    }

}
