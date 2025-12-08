package com.jc.healthcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jc.healthcare.model.LabTest;

public interface LabTestRepository extends JpaRepository<LabTest, Long> {
}
