package com.jc.healthcare.service;

import com.jc.healthcare.model.Medicine;
import com.jc.healthcare.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    // ✅ Get all medicines
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    // ✅ Get by ID
    public Medicine getMedicineById(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found with ID: " + id));
    }

    // ✅ Create new medicine
    public Medicine createMedicine(Medicine medicine) {
        medicine.setCreatedAt(new Date());
        return medicineRepository.save(medicine);
    }

    // ✅ Update medicine (PATCH logic)
    public Medicine updateMedicine(Long id, Medicine updatedMedicine) {
        Medicine existing = getMedicineById(id);

        if (updatedMedicine.getMedicineName() != null)
            existing.setMedicineName(updatedMedicine.getMedicineName());
        if (updatedMedicine.getCategory() != null)
            existing.setCategory(updatedMedicine.getCategory());
        if (updatedMedicine.getManufacturer() != null)
            existing.setManufacturer(updatedMedicine.getManufacturer());
        if (updatedMedicine.getBatchNo() != null)
            existing.setBatchNo(updatedMedicine.getBatchNo());
        if (updatedMedicine.getPricePerUnit() != null)
            existing.setPricePerUnit(updatedMedicine.getPricePerUnit());
        if (updatedMedicine.getPurchaseCost() != null)
            existing.setPurchaseCost(updatedMedicine.getPurchaseCost());
        if (updatedMedicine.getQuantityAvailable() != null)
            existing.setQuantityAvailable(updatedMedicine.getQuantityAvailable());
        if (updatedMedicine.getReorderLevel() != null)
            existing.setReorderLevel(updatedMedicine.getReorderLevel());
        if (updatedMedicine.getExpiryDate() != null)
            existing.setExpiryDate(updatedMedicine.getExpiryDate());
        if (updatedMedicine.getDescription() != null)
            existing.setDescription(updatedMedicine.getDescription());
        if (updatedMedicine.getStatus() != null)
            existing.setStatus(updatedMedicine.getStatus());
        if (updatedMedicine.getLocationOfRack() != null)
            existing.setLocationOfRack(updatedMedicine.getLocationOfRack());
        if (updatedMedicine.getSupplierId() != null)
            existing.setSupplierId(updatedMedicine.getSupplierId());
        if (updatedMedicine.getUpdatedBy() != null)
            existing.setUpdatedBy(updatedMedicine.getUpdatedBy());

        existing.setUpdatedAt(new Date());

        return medicineRepository.save(existing);
    }

    // ✅ Delete medicine
    public void deleteMedicine(Long id) {
        Medicine medicine = getMedicineById(id);
        medicineRepository.delete(medicine);
    }

    // ✅ Out-of-stock medicines
    public List<Medicine> getOutOfStockMedicines() {
        return medicineRepository.findByQuantityAvailableLessThanEqual(0);
    }

    // ✅ Expired medicines
    public List<Medicine> getExpiredMedicines() {
        return medicineRepository.findByExpiryDateBefore(new Date());
    }
}
