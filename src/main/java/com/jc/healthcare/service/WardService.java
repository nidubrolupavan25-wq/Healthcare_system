package com.jc.healthcare.service;

import com.jc.healthcare.model.Ward;
import com.jc.healthcare.repository.BedBookingRepository;
import com.jc.healthcare.repository.WardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WardService {

    @Autowired
    private WardRepository wardRepository;
    @Autowired
    private BedBookingRepository bedBookingRepository;

 

    public Ward addWard(Ward ward) {
        if (wardRepository.existsByWardName(ward.getWardName())) {
            throw new RuntimeException("Ward with the same name already exists");
        }
        return wardRepository.save(ward);
    }

    public List<Ward> getAllWards() {
        return wardRepository.findAll();
    }

    public Ward getWardById(Long id) {
        return wardRepository.findById(id).orElse(null);
    }
    public String deleteWardIfEmpty(Long wardId) {
        // 1️⃣ Check if ward exists
        Ward ward = wardRepository.findById(wardId)
                .orElseThrow(() -> new RuntimeException("Ward not found with ID: " + wardId));

        // 2️⃣ Check if any active beds exist
        long activeBeds = bedBookingRepository.countBookedBedsByWard(wardId);
        if (activeBeds > 0) {
            return "Cannot delete ward. Ward must be empty before deletion.";
        }

        // 3️⃣ Delete related bed_booking entries
        bedBookingRepository.deleteAll(
                bedBookingRepository.findByWard(ward)
        );

        // 4️⃣ Delete the ward itself
        wardRepository.delete(ward);

        return "Ward and its related bed bookings deleted successfully.";
    }
    
}
