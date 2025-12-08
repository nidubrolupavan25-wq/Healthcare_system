package com.jc.healthcare.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "prescription")
public class Prescription {

    @Id
   
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long doctorId;

    @Column(nullable = false)
    private Long patientId;

    @Column(nullable = false, length = 255)
    private String dosageInstructions;

    private LocalDateTime generatedAt;
    private String notes;
    private String selectedMedicines;
    private LocalDate dateIssued;
    private String dosage;
    private String medication;
    private String selectedTests;
}
