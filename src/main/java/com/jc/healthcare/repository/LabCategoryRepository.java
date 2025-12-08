package com.jc.healthcare.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jc.healthcare.model.LabCategory;

public interface LabCategoryRepository extends JpaRepository<LabCategory, Long> {

	List<LabCategory> findAll();
}
