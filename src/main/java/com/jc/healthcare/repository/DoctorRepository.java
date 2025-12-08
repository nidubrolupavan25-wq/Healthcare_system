package com.jc.healthcare.repository;

import com.jc.healthcare.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findByStatus(String status);

    List<Doctor> findBySpecialization(String specialization);

    Optional<Doctor> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByMedicalLicenseNo(String medicalLicenseNo);
    @Query("SELECT COUNT(d) FROM Doctor d")
    long getDoctorCount();
}
