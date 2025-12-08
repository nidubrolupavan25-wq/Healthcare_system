package com.jc.healthcare.repository;

import com.jc.healthcare.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    // Get medicines that are out of stock
    List<Medicine> findByQuantityAvailableLessThanEqual(Integer quantity);

    // Get expired medicines
    List<Medicine> findByExpiryDateBefore(Date currentDate);
}
