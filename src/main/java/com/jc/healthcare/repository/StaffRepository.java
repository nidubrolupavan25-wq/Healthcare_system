package com.jc.healthcare.repository;

import com.jc.healthcare.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {

    List<Staff> findByDepartmentIgnoreCase(String department);

    boolean existsByAdhar(String adhar);

    Staff findByEmail(String email);
}
