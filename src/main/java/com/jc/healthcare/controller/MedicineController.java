package com.jc.healthcare.controller;

import com.jc.healthcare.model.Medicine;
import com.jc.healthcare.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin("*")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    // ✅ GET all medicines
    @GetMapping
    public ResponseEntity<List<Medicine>> getAllMedicines() {
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }

    // ✅ GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(@PathVariable Long id) {
        return ResponseEntity.ok(medicineService.getMedicineById(id));
    }

    // ✅ CREATE medicine
    @PostMapping
    public ResponseEntity<Medicine> createMedicine(@RequestBody Medicine medicine) {
        return ResponseEntity.ok(medicineService.createMedicine(medicine));
    }

    // ✅ PATCH / Update medicine
    @PatchMapping("/{id}")
    public ResponseEntity<Medicine> updateMedicine(@PathVariable Long id, @RequestBody Medicine updatedMedicine) {
        return ResponseEntity.ok(medicineService.updateMedicine(id, updatedMedicine));
    }

    // ✅ DELETE medicine
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok("Medicine deleted successfully with ID: " + id);
    }

    // ✅ GET Out-of-stock
    @GetMapping("/out-of-stock")
    public ResponseEntity<List<Medicine>> getOutOfStockMedicines() {
        return ResponseEntity.ok(medicineService.getOutOfStockMedicines());
    }

    // ✅ GET Expired medicines
    @GetMapping("/expired")
    public ResponseEntity<List<Medicine>> getExpiredMedicines() {
        return ResponseEntity.ok(medicineService.getExpiredMedicines());
    }
}
