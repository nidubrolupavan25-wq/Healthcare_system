package com.jc.healthcare.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "LAB_TEST")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LabTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TEST_ID")
    private Long testId;

    @ManyToOne
    @JoinColumn(name = "CATEGORY_ID", nullable = false)
    private LabCategory category;

    @Column(name = "TEST_NAME", nullable = false, length = 200)
    private String testName;

    @Column(name = "TEST_COST")
    private Double testCost;
}
