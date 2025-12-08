package com.jc.healthcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jc.healthcare.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
}
