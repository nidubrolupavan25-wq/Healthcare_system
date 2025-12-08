package com.jc.healthcare.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "patients") 
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "patient_seq_gen")
    @SequenceGenerator(
        name = "patient_seq_gen",
        sequenceName = "PATIENT_SEQ",
        allocationSize = 1
    )
    @Column(name = "PATIENT_ID")
    private Long patientId;

    @Column(name = "NAME", nullable = false, length = 100)
    private String name;

    @Column(name = "GENDER", length = 10)
    private String gender;

    @Column(name = "AADHAR", length = 12)
    private String aadhar;

    @Column(name = "PHONE", length = 15)
    private String phone;

    @Column(name = "DATE_OF_BIRTH")
    private LocalDate dateOfBirth;

    @Column(name = "ADDRESS", length = 255)
    private String address;

    @Column(name = "DOCTOR_ID")
    private Long doctorId;

    // 🗓️ Appointment info
    @Column(name = "APPOINTMENT_DATE", length = 20)
    private String appointmentDate;

    @Column(name = "APPOINTMENT_TIME", length = 20)
    private String appointmentTime;

   

    @Column(name = "DOSAGE_INSTRUCTIONS", length = 255)
    private String dosageInstructions;

    @Column(name = "GENERATED_AT")
    private LocalDate generatedAt;

    @Column(name = "NOTES", length = 500)
    private String notes;

    @Column(name = "SELECTED_MEDICINES", length = 500)
    private String selectedMedicines;

    @Column(name = "DATE_ISSUED")
    private LocalDate dateIssued;

    @Column(name = "DISEASE", length = 100)
    private String disease;

    @Column(name = "MEDICATION", length = 200)
    private String medication;

    @Column(name = "SELECTED_TESTS", length = 500)
    private String selectedTests;

    @Column(name = "MEDISION_STATUS", length = 50)
    private String medisionStatus;

    @Column(name = "DOCTOR_STATUS", length = 50)
    private String doctorStatus;

    @Column(name = "LAB_STATUS", length = 50)
    private String labStatus;

	
}
