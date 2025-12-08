package com.jc.healthcare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Add scanBasePackages to include all your custom packages
@SpringBootApplication(scanBasePackages = {"com.jc.healthcare.controller", "com.jc.healthcare.service", "com.jc.healthcare.model", "com.jc.healthcare.repository"})
public class HealthcareApplication {

	public static void main(String[] args) {
		SpringApplication.run(HealthcareApplication.class, args);
	}

}