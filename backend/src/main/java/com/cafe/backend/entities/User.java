package com.cafe.backend.entities;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false)
    private String firstName;

    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @Column(nullable = false, unique = true)
//    @Pattern(regexp = "^[0-9]{10}$", message="phone number must be exactly 10 digits")
    private String phone;

}
