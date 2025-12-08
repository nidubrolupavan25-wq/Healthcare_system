package com.jc.healthcare.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "LAB_REPORT")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LabReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "REPORT_ID")
    private Long reportId;

    @Column(name = "PATIENT_ID", nullable = false)
    private Long patientId;

    @ManyToOne
    @JoinColumn(name = "TEST_ID", nullable = false)
    private LabTest test;

    @Lob
    @Column(name = "REPORT_FILE")
    private byte[] reportFile;

    @Column(name = "FILE_NAME", length = 255)
    private String fileName;

    @Column(name = "FILE_TYPE", length = 50)
    private String fileType;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "UPLOADED_ON")
    private Date uploadedOn = new Date();
}
