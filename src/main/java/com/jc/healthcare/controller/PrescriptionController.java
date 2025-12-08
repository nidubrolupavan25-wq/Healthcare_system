package com.jc.healthcare.controller;

import com.jc.healthcare.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin("*")
public class PrescriptionController {

    @Autowired
    private PrescriptionService service;

    @GetMapping("/lab/urgent")
    public ResponseEntity<Map<String, Object>> getUrgentLabsToday() {
        return ResponseEntity.ok(service.getUrgentLabsToday());
    }

    @GetMapping("/lab/pending")
    public ResponseEntity<Map<String, Object>> getPendingLabsToday() {
        return ResponseEntity.ok(service.getPendingLabsToday());
    }

    @GetMapping("/lab/completed")
    public ResponseEntity<Map<String, Object>> getCompletedLabsToday() {
        return ResponseEntity.ok(service.getCompletedLabsToday());
    }

    @GetMapping("/lab/all")
    public ResponseEntity<Map<String, Object>> getAllLabsToday() {
        return ResponseEntity.ok(service.getAllLabsToday());
    }
}
