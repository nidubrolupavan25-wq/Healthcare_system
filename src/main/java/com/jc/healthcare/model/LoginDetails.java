package com.jc.healthcare.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "LOGIN_DETAILS")
public class LoginDetails {

    @Id
    @Column(name = "EMAIL", nullable = false, unique = true)
    private String email; // now email acts as the primary key

    @Column(name = "PASSWORD", nullable = false)
    private String password;

    @Column(name = "ROLE")
    private String role;
}
