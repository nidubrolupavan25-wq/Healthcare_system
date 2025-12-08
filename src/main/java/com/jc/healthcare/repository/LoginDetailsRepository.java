package com.jc.healthcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.jc.healthcare.model.LoginDetails;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface LoginDetailsRepository extends JpaRepository<LoginDetails, Long> {

    // Works for all Spring Boot versions
    @Query("SELECT CASE WHEN COUNT(l) > 0 THEN true ELSE false END FROM LoginDetails l WHERE l.email = :email")
    boolean existsByEmail(@Param("email") String email);
}
