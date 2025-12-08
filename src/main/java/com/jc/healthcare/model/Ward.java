package com.jc.healthcare.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "ward_master")
public class Ward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ward_id")
    private Long wardId;

    @Column(name = "ward_name", nullable = false)
    private String wardName;

    @Column(name = "ward_type")
    private String wardType; // General, ICU, etc.

    @Column(name = "total_beds", nullable = false)
    private int totalBeds;

    @Column(name = "created_on")
    private LocalDate createdOn = LocalDate.now();
}
