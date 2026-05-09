package com.cafe.backend.service.user;

import com.cafe.backend.entities.User;
import com.cafe.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepo;

    public String register(User user) {

        Optional<User> savedUser = userRepo.findByEmail(user.getEmail());

        if(savedUser.isPresent()) {
            return "User already exists";
        }
            userRepo.save(user);

        return "User registered successfully";
    }

    public User login(String email, String password) {
        Optional<User> savedUser = userRepo.findByEmail(email);

        if(savedUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = savedUser.get();

        if(!user.getPassword().equals(password)) {
            throw new RuntimeException("Wrong password");
        }
        return user;

    }
}


