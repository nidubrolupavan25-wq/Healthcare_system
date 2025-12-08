package com.jc.healthcare.repository;

import com.jc.healthcare.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    // 🔹 1️⃣ URGENT LAB STATUS + TODAY'S PRESCRIPTION
    @Query(value = """
        SELECT p.patient_id, p.name, p.lab_status, pr.date_issued,
               pr.selected_medicines, pr.selected_tests, pr.dosage, pr.medication
        FROM patients p
        JOIN prescription pr ON p.patient_id = pr.patient_id
        WHERE LOWER(p.lab_status) = 'urgent'
        AND TRUNC(pr.date_issued) = TRUNC(SYSDATE)
        """, nativeQuery = true)
    List<Object[]> findUrgentLabsToday();

    @Query(value = """
        SELECT COUNT(*)
        FROM patients p
        JOIN prescription pr ON p.patient_id = pr.patient_id
        WHERE LOWER(p.lab_status) = 'urgent'
        AND TRUNC(pr.date_issued) = TRUNC(SYSDATE)
        """, nativeQuery = true)
    Long countUrgentLabsToday();


    // 🔹 2️⃣ PENDING LAB STATUS + TODAY'S PRESCRIPTION
    @Query(value = """
        SELECT p.patient_id, p.name, p.lab_status, pr.date_issued,
               pr.selected_medicines, pr.selected_tests, pr.dosage, pr.medication
        FROM patients p
        JOIN prescription pr ON p.patient_id = pr.patient_id
        WHERE LOWER(p.lab_status) = 'pending'
        AND TRUNC(pr.date_issued) = TRUNC(SYSDATE)
        """, nativeQuery = true)
    List<Object[]> findPendingLabsToday();

    @Query(value = """
        SELECT COUNT(*)
        FROM patients p
        JOIN prescription pr ON p.patient_id = pr.patient_id
        WHERE LOWER(p.lab_status) = 'pending'
        AND TRUNC(pr.date_issued) = TRUNC(SYSDATE)
        """, nativeQuery = true)
    Long countPendingLabsToday();


    // 🔹 3️⃣ COMPLETED LAB STATUS + TODAY'S PRESCRIPTION
    @Query(value = """
        SELECT p.patient_id, p.name, p.lab_status, pr.date_issued,
               pr.selected_medicines, pr.selected_tests, pr.dosage, pr.medication
        FROM patients p
        JOIN prescription pr ON p.patient_id = pr.patient_id
        WHERE LOWER(p.lab_status) = 'completed'
        AND TRUNC(pr.date_issued) = TRUNC(SYSDATE)
        """, nativeQuery = true)
    List<Object[]> findCompletedLabsToday();

    @Query(value = """
        SELECT COUNT(*)
        FROM patients p
        JOIN prescription pr ON p.patient_id = pr.patient_id
        WHERE LOWER(p.lab_status) = 'completed'
        AND TRUNC(pr.date_issued) = TRUNC(SYSDATE)
        """, nativeQuery = true)
    Long countCompletedLabsToday();


    // 🔹 4️⃣ ALL (lab_status IS NOT NULL)
    @Query(value = """
        SELECT p.patient_id, p.name, p.lab_status, pr.date_issued,
               pr.selected_medicines, pr.selected_tests, pr.dosage, pr.medication
        FROM patients p
        JOIN prescription pr ON p.patient_id = pr.patient_id
        WHERE p.lab_status IS NOT NULL
        AND TRUNC(pr.date_issued) = TRUNC(SYSDATE)
        """, nativeQuery = true)
    List<Object[]> findAllWithLabStatusToday();

    @Query(value = """
        SELECT COUNT(*)
        FROM patients p
        JOIN prescription pr ON p.patient_id = pr.patient_id
        WHERE p.lab_status IS NOT NULL
        AND TRUNC(pr.date_issued) = TRUNC(SYSDATE)
        """, nativeQuery = true)
    Long countAllWithLabStatusToday();
}
