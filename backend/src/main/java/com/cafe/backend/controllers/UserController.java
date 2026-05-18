package com.cafe.backend.controllers;

import com.cafe.backend.dtos.auth.LoginRequest;
import com.cafe.backend.dtos.auth.RegisterRequest;
import com.cafe.backend.dtos.auth.RegisterResponse;
import com.cafe.backend.entities.User;
import com.cafe.backend.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<RegisterResponse> login(@RequestBody LoginRequest loginRequest){
        try{
            User user = userService.login(loginRequest.getEmail(),loginRequest.getPassword());

            RegisterResponse response = new RegisterResponse(
                    user.getId(),
                    user.getFirstName(),
                    user.getEmail(),
                    user.getPhone(),
                    user.getRole().name(),
                    "Logged in successfully"
            );
            return ResponseEntity.ok(response);
        }
        catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new RegisterResponse(null,null,null,null,null,e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request){
        try {
            RegisterResponse response = userService.register(request);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new RegisterResponse(null,null,null,null,null,e.getMessage()));

        }
    }

}
