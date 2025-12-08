package com.jc.healthcare.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
@Table(name = "medicine")
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "medicine_seq")
    @SequenceGenerator(name = "medicine_seq", sequenceName = "MEDICINE_SEQ", allocationSize = 1)
    @Column(name = "MEDICINE_ID")
    private Long id;

    @Column(name = "MEDICINE_NAME", nullable = false, length = 100)
    private String medicineName;

    @Column(name = "CATEGORY", length = 50)
    private String category;

    @Column(name = "MANUFACTURER", length = 100)
    private String manufacturer;

    @Column(name = "BATCH_NO", length = 50)
    private String batchNo;

    @Column(name = "PRICE_PER_UNIT")
    private Double pricePerUnit;

    @Column(name = "PURCHASE_COST")
    private Double purchaseCost;

    @Column(name = "QUANTITY_AVAILABLE")
    private Integer quantityAvailable;

    @Column(name = "REORDER_LEVEL")
    private Integer reorderLevel;

    @Temporal(TemporalType.DATE)
    @Column(name = "EXPIRY_DATE")
    private Date expiryDate;

    @Column(name = "DESCRIPTION", length = 255)
    private String description;

    @Column(name = "STATUS", length = 20)
    private String status;

    @Column(name = "LOCATION_OF_RACK", length = 150)
    private String locationOfRack;

    @Column(name = "SUPPLIER_ID")
    private Long supplierId;

    @Column(name = "CREATED_BY", length = 50)
    private String createdBy;

    @Column(name = "UPDATED_BY", length = 50)
    private String updatedBy;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CREATED_AT")
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "UPDATED_AT")
    private Date updatedAt;
}
