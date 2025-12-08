package com.jc.healthcare.controller;

import com.jc.healthcare.model.BedBooking;
import com.jc.healthcare.model.Ward;
import com.jc.healthcare.repository.BedBookingRepository;
import com.jc.healthcare.service.WardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wards")
@CrossOrigin(origins = "http://localhost:3000")
public class WardController {

    @Autowired
    private WardService wardService;

    @Autowired
    private BedBookingRepository bedBookingRepository;

    // Add ward
    @PostMapping("/add")
    public Ward addWard(@RequestBody Ward ward) {
        return wardService.addWard(ward);
    }

    // Get all wards
    @GetMapping("/all")
    public List<Ward> getAllWards() {
        return wardService.getAllWards();
    }

    // Get ward by ID
    @GetMapping("/{id}")
    public Ward getWardById(@PathVariable Long id) {
        return wardService.getWardById(id);
    }

    // Total beds from ward table
    @GetMapping("/{wardId}/total-beds")
    public long getTotalBeds(@PathVariable Long wardId) {
        return bedBookingRepository.countTotalBedsByWard(wardId);
    }
    // Booked beds count
    @GetMapping("/{wardId}/booked-beds")
    public long getBookedBeds(@PathVariable Long wardId) {
        return bedBookingRepository.countBookedBedsByWard(wardId);
    }

    // Available beds count
    @GetMapping("/{wardId}/available-beds")
    public long getAvailableBeds(@PathVariable Long wardId) {
        return bedBookingRepository.countAvailableBedsByWard(wardId);
    }
    @DeleteMapping("/delete/{wardId}")
    public String deleteWard(@PathVariable Long wardId) {
        return wardService.deleteWardIfEmpty(wardId);
    }


}
