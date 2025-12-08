package com.jc.healthcare.service;

import com.jc.healthcare.model.BedBooking;
import com.jc.healthcare.model.Ward;
import com.jc.healthcare.repository.BedBookingRepository;
import com.jc.healthcare.repository.WardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class BedBookingService {

    @Autowired
    private BedBookingRepository bookingRepository;

    @Autowired
    private WardRepository wardRepository;

    public BedBooking bookBed(BedBooking bedBooking) {
        Ward ward = wardRepository.findById(bedBooking.getWard().getWardId())
                .orElseThrow(() -> new RuntimeException("Ward not found"));

        List<BedBooking> activeBookings = bookingRepository.findActiveBookingByBedAndWard(
                bedBooking.getBedId(), bedBooking.getWard().getWardId()
        );

        if (!activeBookings.isEmpty()) {
            throw new RuntimeException("This bed is already booked");
        }

        List<BedBooking> availableBookings = bookingRepository.findAvailableBedByBedAndWard(
                bedBooking.getBedId(), bedBooking.getWard().getWardId()
        );

        if (availableBookings.isEmpty()) {
            throw new RuntimeException("No available bed found for this ward and bed");
        }

        BedBooking booking = availableBookings.get(0);
        booking.setStatus("Active");
        booking.setPatientId(bedBooking.getPatientId());
        booking.setAdmissionDate(LocalDate.now());
        booking.setDischargeDate(bedBooking.getDischargeDate());

        return bookingRepository.save(booking);
    }

    // OLD: Only for discharge
    public BedBooking discharge(Long bookingId) {
        BedBooking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking != null && "Active".equals(booking.getStatus())) {
            booking.setStatus("Completed");
            booking.setDischargeDate(LocalDate.now().toString());
            return bookingRepository.save(booking);
        }
        return null;
    }

    public List<BedBooking> getAllBookings() {
        return bookingRepository.findAll();
    }

 // CHANGE DISCHARGE DATE
    public BedBooking updateDischargeDate(Long wardId, Long bedId, String dischargeDate) {
        List<BedBooking> activeBookings = bookingRepository.findActiveBookingByBedAndWard(bedId, wardId);
        
        if (activeBookings.isEmpty()) {
            throw new RuntimeException("No active booking found for bedId: " + bedId + " in wardId: " + wardId);
        }

        BedBooking booking = activeBookings.get(0);
        booking.setDischargeDate(dischargeDate);
        
        return bookingRepository.save(booking);
    }

    // MAKE AVAILABLE
    public BedBooking makeBedAvailable(Long wardId, Long bedId) {
        List<BedBooking> bookings = bookingRepository.findByBedIdAndWardId(bedId, wardId);
        
        if (bookings.isEmpty()) {
            throw new RuntimeException("No booking record found for bedId: " + bedId + " in wardId: " + wardId);
        }

        BedBooking booking = bookings.get(0); // Take first (should be only one)

        booking.setStatus("Available");
        booking.setPatientId(null);
        booking.setDischargeDate(null);
        booking.setAdmissionDate(null);

        return bookingRepository.save(booking);
    }
 
    public String deleteBed(Long wardId, Long bedId) {
        List<BedBooking> existingBeds = bookingRepository.findByBedIdAndWardId(bedId, wardId);

        if (existingBeds.isEmpty()) {
            return "No bed found with bedId " + bedId + " in wardId " + wardId;
        }

        BedBooking bed = existingBeds.get(0);

        // ✅ Check if bed is Active (has patient)
        if ("Active".equalsIgnoreCase(bed.getStatus())) {
            return "This bed has a patient. Please make the bed empty before deleting.";
        }

        // ✅ If bed is Available or Completed → delete
        bookingRepository.deleteAll(existingBeds);
        return "Bed with bedId " + bedId + " deleted successfully from wardId " + wardId;
    }

    
    public Object addBed(Long wardId, Long bedId) {
        Ward ward = wardRepository.findById(wardId)
                .orElseThrow(() -> new RuntimeException("Ward not found with id: " + wardId));

        // ✅ Check if this bed already exists in this ward
        List<BedBooking> existingBeds = bookingRepository.findByBedIdAndWardId(bedId, wardId);
        if (!existingBeds.isEmpty()) {
            // Return a friendly message instead of throwing an exception
            return Map.of(
                "message", "Bed with bedId " + bedId + " already exists in wardId " + wardId
            );
        }

        // ✅ Create and save a new bed record
        BedBooking bedBooking = new BedBooking();
        bedBooking.setBedId(bedId);
        bedBooking.setWard(ward);
        bedBooking.setPatientId(null);
        bedBooking.setAdmissionDate(null);
        bedBooking.setDischargeDate(null);
        bedBooking.setStatus("Available");

        BedBooking saved = bookingRepository.save(bedBooking);

        return Map.of(
            "message", "Bed added successfully",
            "data", saved
        );
    }

    

}