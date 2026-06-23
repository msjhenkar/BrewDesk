package com.cafe.backend.controllers;

import com.cafe.backend.dtos.auth.*;
import com.cafe.backend.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
        try{
            RegisterResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new RegisterResponse(null,null,null,null,null, e.getMessage()));
        }

    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(null, null, null, null, "Invalid email or password"));
        }
    }

//    @GetMapping("/generate-hash")
//    public String generateHash(@RequestParam String password) {
//        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(password);
//    }


}
