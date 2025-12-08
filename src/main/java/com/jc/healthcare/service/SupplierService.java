package com.jc.healthcare.service;

import com.jc.healthcare.model.Supplier;
import com.jc.healthcare.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id).orElse(null);
    }

    public Supplier createSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(Long id, Supplier supplier) {
        Supplier existing = supplierRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setSupplierName(supplier.getSupplierName());
            existing.setCompanyName(supplier.getCompanyName());
            existing.setEmail(supplier.getEmail());
            existing.setContact(supplier.getContact());
            existing.setStatus(supplier.getStatus());
            existing.setSupplyDate(supplier.getSupplyDate());
            existing.setUpdatedAt(new java.util.Date());
            return supplierRepository.save(existing);
        }
        return null;
    }

    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }
}
