package com.cafe.backend.dtos.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterResponse {
    private Long id;
    private String firstName;
    private String email;
    private String phone;
    private String role;
    private String message;

}
