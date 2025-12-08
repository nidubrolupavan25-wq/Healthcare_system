package com.jc.healthcare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jc.healthcare.model.User;
import com.jc.healthcare.repository.UserRepository;

@Service
public class RegistrationService {

    @Autowired
    private UserRepository userRepository; // Remove static

    public String registerUser(User user) { // Remove static
        if (userRepository.existsByEmail(user.getEmail())) {
            return "Email already registered";
        }
        userRepository.save(user);
        return "Registration Successful";
    }
}
