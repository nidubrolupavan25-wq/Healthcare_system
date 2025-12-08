package com.jc.healthcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jc.healthcare.model.LabReport;
import java.util.List;

public interface LabReportRepository extends JpaRepository<LabReport, Long> {
    List<LabReport> findByPatientId(Long patientId);
}
