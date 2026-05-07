package com.cafe.backend.dtos.auth;

import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;

@Data
public class LoginRequest {

    private String email;
    private String password;



}
