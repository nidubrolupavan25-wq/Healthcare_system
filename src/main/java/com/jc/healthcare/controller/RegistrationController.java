package com.jc.healthcare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.jc.healthcare.model.User;
import com.jc.healthcare.service.RegistrationService;

@RestController
@RequestMapping("/api")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        return registrationService.registerUser(user); // Use instance, not class
    }
}
