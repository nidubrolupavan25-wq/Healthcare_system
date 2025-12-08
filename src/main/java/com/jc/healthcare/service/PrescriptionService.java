package com.jc.healthcare.service;

import com.jc.healthcare.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository repository;

    // ✅ Urgent labs today
    public Map<String, Object> getUrgentLabsToday() {
        List<Object[]> data = repository.findUrgentLabsToday();
        Long count = repository.countUrgentLabsToday();
        Map<String, Object> response = new HashMap<>();
        response.put("count", count);
        response.put("data", data);
        return response;
    }

    // ✅ Pending labs today
    public Map<String, Object> getPendingLabsToday() {
        List<Object[]> data = repository.findPendingLabsToday();
        Long count = repository.countPendingLabsToday();
        Map<String, Object> response = new HashMap<>();
        response.put("count", count);
        response.put("data", data);
        return response;
    }

    // ✅ Completed labs today
    public Map<String, Object> getCompletedLabsToday() {
        List<Object[]> data = repository.findCompletedLabsToday();
        Long count = repository.countCompletedLabsToday();
        Map<String, Object> response = new HashMap<>();
        response.put("count", count);
        response.put("data", data);
        return response;
    }

    // ✅ All labs today (non-null lab status)
    public Map<String, Object> getAllLabsToday() {
        List<Object[]> data = repository.findAllWithLabStatusToday();
        Long count = repository.countAllWithLabStatusToday();
        Map<String, Object> response = new HashMap<>();
        response.put("count", count);
        response.put("data", data);
        return response;
    }
}
