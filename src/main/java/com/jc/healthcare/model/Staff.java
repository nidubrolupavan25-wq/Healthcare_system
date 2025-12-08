
package com.jc.healthcare.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
@Table(name = "STAFF_MASTER")
public class Staff {

    @Id
    @SequenceGenerator(name = "staff_seq", sequenceName = "STAFF_SEQ", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "staff_seq")
    @Column(name = "STAFF_ID")
    private Long id;

    @Column(name = "FULL_NAME", nullable = false)
    private String name;

    @Column(name = "MOBILE_NUMBER", nullable = false)
    private String mobile;

    @Column(name = "EMAIL_ID")
    private String email;

    @Column(name = "AADHAR_NUMBER")
    private String adhar;

    @Column(name = "ADDRESS")
    private String address;

    @Column(name = "DEPARTMENT")
    private String department;

    @Column(name = "ROLE")
    private String role;

    @Column(name = "SALARY")
    private Double salary;

    @Temporal(TemporalType.DATE)
    @Column(name = "JOINING_DATE")
    private Date joiningDate;

    @Column(name = "SHIFT_TIMINGS")
    private String timings;

    @Lob
    @Column(name = "IMAGE")
    private byte[] image;
 
    @Column(name = "TWO_FACTOR_AUTHENTICATION")
    private Integer twoFactAuthentication;

    // 🔐 Authentication fields
    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "LOGIN_ATTEMPTS")
    private Integer loginAttempts = 0;

    // 🚫 Account lock
    @Transient
    private boolean accountLocked;

    // OTP fields (not stored permanently)
    @Transient
    private String otp;

	
}