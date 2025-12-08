package com.jc.healthcare.service;

import com.jc.healthcare.model.*;
import com.jc.healthcare.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LabService {

    @Autowired
    private LabCategoryRepository categoryRepo;

    @Autowired
    private LabTestRepository testRepo;

    @Autowired
    private LabReportRepository reportRepo;

    @Autowired
    private PrescriptionRepository prescriptionRepo;


    public List<LabCategory> getAllCategories() {
        return categoryRepo.findAll();
    }

    public LabCategory addCategory(LabCategory category) {
        return categoryRepo.save(category);
    }

    public LabCategory updateCategory(Long id, LabCategory updated) {
        LabCategory category = categoryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setCategoryName(updated.getCategoryName());
        return categoryRepo.save(category);
    }

    public void deleteCategory(Long id) {
        categoryRepo.deleteById(id);
    }

  

    public List<LabTest> getAllTests() {
        return testRepo.findAll();
    }

    public LabTest addTest(LabTest test) {
        return testRepo.save(test);
    }

    public LabTest patchUpdateTest(Long id, LabTest partialTest) {
        LabTest test = testRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Test not found"));

        if (partialTest.getTestName() != null)
            test.setTestName(partialTest.getTestName());

        if (partialTest.getTestCost() != null)
            test.setTestCost(partialTest.getTestCost());

        if (partialTest.getCategory() != null)
            test.setCategory(partialTest.getCategory());

        return testRepo.save(test);
    }

    public void deleteTest(Long id) {
        testRepo.deleteById(id);
    }

   

    public LabReport uploadReport(Long patientId, Long testId, MultipartFile file) throws IOException {
        LabTest test = testRepo.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));

        LabReport report = new LabReport();
        report.setPatientId(patientId);
        report.setTest(test);
        report.setFileName(file.getOriginalFilename());
        report.setFileType(file.getContentType());
        report.setReportFile(file.getBytes());

        return reportRepo.save(report);
    }

    public List<LabReport> getReportsByPatient(Long patientId) {
        return reportRepo.findByPatientId(patientId);
    }

    public void deleteReport(Long reportId) {
        reportRepo.deleteById(reportId);
    }

    public LabReport patchUpdateReportFile(Long reportId, MultipartFile newFile) throws IOException {
        LabReport report = reportRepo.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        if (newFile != null && !newFile.isEmpty()) {
            report.setFileName(newFile.getOriginalFilename());
            report.setFileType(newFile.getContentType());
            report.setReportFile(newFile.getBytes());
        }

        return reportRepo.save(report);
    }

  
    private List<Map<String, Object>> formatPrescriptionData(List<Object[]> rawData) {
        return rawData.stream().map(row -> {
            Map<String, Object> record = new LinkedHashMap<>();
            record.put("patientId", ((Number) row[0]).longValue());
            record.put("patientName", row[1]);
            record.put("labStatus", row[2]);
            record.put("dateIssued", row[3] != null ? ((Timestamp) row[3]).toLocalDateTime() : null);
            record.put("selectedMedicines", row[4]);
            record.put("selectedTests", row[5]);
            record.put("dosage", row[6]);
            record.put("medication", row[7]);
            return record;
        }).collect(Collectors.toList());
    }

    
    public Map<String, Object> getUrgentLabsWithPrescriptionToday() {
        List<Object[]> rawData = prescriptionRepo.findUrgentLabsToday();
        List<Map<String, Object>> data = formatPrescriptionData(rawData);
        Map<String, Object> response = new HashMap<>();
        response.put("count", data.size());
        response.put("data", data);
        return response;
    }

    
    public Map<String, Object> getPendingLabsWithPrescriptionToday() {
        List<Object[]> rawData = prescriptionRepo.findPendingLabsToday();
        List<Map<String, Object>> data = formatPrescriptionData(rawData);
        Map<String, Object> response = new HashMap<>();
        response.put("count", data.size());
        response.put("data", data);
        return response;
    }

   
    public Map<String, Object> getCompletedLabsWithPrescriptionToday() {
        List<Object[]> rawData = prescriptionRepo.findCompletedLabsToday();
        List<Map<String, Object>> data = formatPrescriptionData(rawData);
        Map<String, Object> response = new HashMap<>();
        response.put("count", data.size());
        response.put("data", data);
        return response;
    }

        public Map<String, Object> getAllLabsWithPrescriptionToday() {
        List<Object[]> rawData = prescriptionRepo.findAllWithLabStatusToday();
        List<Map<String, Object>> data = formatPrescriptionData(rawData);
        Map<String, Object> response = new HashMap<>();
        response.put("count", data.size());
        response.put("data", data);
        return response;
    }
}
