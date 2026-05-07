package com.cafe.backend.controllers;

import com.cafe.backend.dtos.auth.LoginRequest;
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
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest){
        try{
            User user = userService.login(loginRequest.getEmail(),loginRequest.getPassword());
            return  ResponseEntity.ok("Logged in successfully");
        }
        catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

}
