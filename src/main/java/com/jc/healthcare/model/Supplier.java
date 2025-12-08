package com.jc.healthcare.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity

@Table(name = "SUPPLIER_MASTER")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SUPPLIER_ID")
    private Long id;

    @Column(name = "SUPLIER_NAME", nullable = false, length = 100)
    private String supplierName;

    @Column(name = "COMPANY_NAME", length = 150)
    private String companyName;

    @Column(name = "S_EMAIL", length = 100)
    private String email;

    @Column(name = "S_CONTACT", length = 15)
    private String contact;

    @Column(name = "S_STATUS", length = 20)
    private String status;

    @Column(name = "SUPALY_DATE")
    @Temporal(TemporalType.DATE)
    private Date supplyDate;

    @Column(name = "CREATED_AT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt = new Date();

    @Column(name = "UPDATED_AT")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt = new Date();

    /* ---------- Getters and Setters ---------- */
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getSupplyDate() {
        return supplyDate;
    }

    public void setSupplyDate(Date supplyDate) {
        this.supplyDate = supplyDate;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}
