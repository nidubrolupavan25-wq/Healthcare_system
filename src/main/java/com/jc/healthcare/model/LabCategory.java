package com.jc.healthcare.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "LAB_CATEGORY")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LabCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CATEGORY_ID")
    private Long categoryId;

    @Column(name = "CATEGORY_NAME", nullable = false, length = 100)
    private String categoryName;
}
