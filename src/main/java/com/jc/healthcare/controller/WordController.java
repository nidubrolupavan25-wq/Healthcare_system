package com.jc.healthcare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wards")
@CrossOrigin("*")
public class WordController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // All beds with booking info
    @GetMapping("/{wardId}/bedss")
    public List<Map<String, Object>> getBeds(@PathVariable int wardId) {
        String sql = "SELECT booking_id AS bookingId, bed_id AS bedId, patient_id AS patient, " +
                     "admission_date AS admissionDate, discharge_date AS dischargeDate, " +
                     "status, ward_id AS wardId " +
                     "FROM bed_booking WHERE ward_id = ? ORDER BY booking_id";
        return jdbcTemplate.queryForList(sql, wardId);
    }

    @GetMapping("/{wardId}/booked-bedss")
    public List<Map<String, Object>> getBookedBeds(@PathVariable Long wardId) {
        String sql = "SELECT booking_id,patient_id, bed_id, ward_id, status, " +
                     "TO_CHAR(admission_date, 'YYYY-MM-DD') AS admission_date, " +
                     "discharge_date " +  // <-- no TO_CHAR
                     "FROM bed_booking " +
                     "WHERE ward_id = ? AND status = 'Active' " +
                     "ORDER BY booking_id";

        return jdbcTemplate.queryForList(sql, wardId);
    }


    // Available beds (Completed or null)
    @GetMapping("/{wardId}/available-bedss")
    public List<Map<String, Object>> getAvailableBeds(@PathVariable int wardId) {
        // Only select columns you need, and format date to yyyy-MM-dd
        String sql = "SELECT bed_id, ward_id, status, TO_CHAR(admission_date, 'YYYY-MM-DD') AS admission_date " +
                     "FROM bed_booking " +
                     "WHERE ward_id = ? AND (status = 'Available' OR status IS NULL)";

        return jdbcTemplate.queryForList(sql, wardId);
    }

}
