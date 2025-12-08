package com.jc.healthcare.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "DOCTORS")
public class Doctor {

    @Id
    @Column(name = "DOCTOR_ID")
    private Long doctorId;  // manual ID insertion

    @Column(name = "DOCTOR_NAME", nullable = false, length = 100)
    private String doctorName;

    @Column(name = "SPECIALIZATION", nullable = false, length = 100)
    private String specialization;

    @Column(name = "PHONE", length = 20)
    private String phone;

    @Column(name = "EMAIL", length = 100)
    private String email;

    @Column(name = "EXPERIENCE")
    private Integer experience;

    @Column(name = "STATUS", length = 10)
    private String status = "ACTIVE";

    @Column(name = "ADDRESS", length = 255)
    private String address;

    // ✅ Store DOB as String in yyyy-MM-dd format
    @Column(name = "DATE_OF_BIRTH", length = 20)
    private String dateOfBirth;

    @Column(name = "GENDER", length = 10)
    private String gender;

    @Column(name = "CITY", length = 100)
    private String city;

    @Column(name = "STATE", length = 100)
    private String state;

    @Column(name = "PIN_CODE", length = 10)
    private String pinCode;

    @Column(name = "COUNTRY", length = 100)
    private String country;

    @Column(name = "MEDICAL_LICENSE_NO", length = 100)
    private String medicalLicenseNo;

    @Column(name = "ROLE", length = 50)
    private String role;

    @Column(name = "IMAGE")
    private byte[] image;

    @Column(name = "PASSWORD", length = 100)
    private String password;

   

    // Constructors
    public Doctor() {
    }
}
