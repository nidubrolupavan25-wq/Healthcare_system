package com.jc.healthcare.controller;

import com.jc.healthcare.model.BedBooking;
import com.jc.healthcare.service.BedBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bed-booking")
@CrossOrigin("*")
public class BedBookingController {

    @Autowired
    private BedBookingService bookingService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/book")
    public BedBooking bookBed(@RequestBody BedBooking bedBooking) {
        return bookingService.bookBed(bedBooking);
    }

    // OLD: మీ ఇప్పటి API - మార్చకుండా ఉంచాను
    @PutMapping("/discharge/{bookingId}")
    public BedBooking discharge(@PathVariable Long bookingId) {
        return bookingService.discharge(bookingId);
    }

    // NEW: wardId + bedId బట్టి అప్‌డేట్
    @PutMapping("/update-by-bed")
    public BedBooking updateByWardAndBed(@RequestBody Map<String, Object> request) {
        Long wardId = Long.valueOf(request.get("wardId").toString());
        Long bedId = Long.valueOf(request.get("bedId").toString());

        if (request.containsKey("dischargeDate")) {
            String dischargeDate = (String) request.get("dischargeDate");
            return bookingService.updateDischargeDate(wardId, bedId, dischargeDate);
        }

        if (request.containsKey("makeAvailable") && (Boolean) request.get("makeAvailable")) {
            return bookingService.makeBedAvailable(wardId, bedId);
        }

        throw new RuntimeException("Invalid request");
    }

    @GetMapping("/all")
    public List<BedBooking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{wardId}/bedss")
    public List<Map<String, Object>> getBeds(@PathVariable int wardId) {
        String sql = "SELECT booking_id AS bookingId, bed_id AS bedId, patient_id AS patientId, " +
                     "TO_CHAR(admission_date, 'YYYY-MM-DD') AS admissionDate, " +
                     "TO_CHAR(discharge_date, 'YYYY-MM-DD') AS dischargeDate, " +
                     "status, ward_id AS wardId " +
                     "FROM bed_booking WHERE ward_id = ? ORDER BY booking_id";

        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, wardId);
        System.out.println("Booking data for ward " + wardId + ": " + result);
        return result;
    }
    @PostMapping("/add-bed")
    public Object addBed(@RequestBody Map<String, Object> request) {
        Long wardId = Long.valueOf(request.get("wardId").toString());
        Long bedId = Long.valueOf(request.get("bedId").toString());
        return bookingService.addBed(wardId, bedId);
    }

    // DELETE BED
    @DeleteMapping("/delete-bed")
    public String deleteBed(@RequestBody Map<String, Object> request) {
        Long wardId = Long.valueOf(request.get("wardId").toString());
        Long bedId = Long.valueOf(request.get("bedId").toString());
        return bookingService.deleteBed(wardId, bedId);
    }

}