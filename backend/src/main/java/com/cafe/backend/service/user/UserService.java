package com.cafe.backend.service.user;

import com.cafe.backend.dtos.auth.RegisterRequest;
import com.cafe.backend.dtos.auth.RegisterResponse;
import com.cafe.backend.entities.User;
import com.cafe.backend.enums.UserRole;
import com.cafe.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepo;

    public RegisterResponse register(RegisterRequest request) {



        //Checking if email already registered
        if(userRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: "+ request.getEmail());
        }

        if(userRepo.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone already exists: "+ request.getPhone());
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(UserRole.CUSTOMER);
        user.setPassword(request.getPassword());

        User saved = userRepo.save(user);

        return new RegisterResponse(
                saved.getId(),
                saved.getFirstName(),
                saved.getEmail(),
                saved.getPhone(),
                saved.getRole().name(),
                "Registered Successfully"
        );
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


