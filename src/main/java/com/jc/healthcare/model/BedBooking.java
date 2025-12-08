package com.jc.healthcare.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "bed_booking")
public class BedBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "bed_booking_seq")
    @SequenceGenerator(name = "bed_booking_seq", sequenceName = "BED_BOOKING_SEQ", allocationSize = 1)
    @Column(name = "BOOKING_ID")
    private Long bookingId;

    @Column(name = "bed_id", nullable = false)
    private Long bedId;

    @ManyToOne
    @JoinColumn(name = "ward_id", nullable = false)
    private Ward ward;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(name = "admission_date")
    private LocalDate admissionDate = LocalDate.now();

    @Column(name = "discharge_date")
    private String dischargeDate;

    @Column(name = "status")
    private String status;
}