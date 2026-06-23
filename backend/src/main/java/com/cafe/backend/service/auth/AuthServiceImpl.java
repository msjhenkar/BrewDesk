package com.cafe.backend.service.auth;

import com.cafe.backend.dtos.auth.*;
import com.cafe.backend.entities.User;
import com.cafe.backend.enums.UserRole;
import com.cafe.backend.repository.UserRepository;
import com.cafe.backend.security.CustomUserDetails;
import com.cafe.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.CUSTOMER); // default role at signup

        User saved = userRepository.save(user);

        return new RegisterResponse(
                saved.getId(),
                saved.getFirstName(),
                saved.getEmail(),
                saved.getPhone(),
                saved.getRole().name(),
                "User registered successfully"
        );
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        // This line does the actual authentication check:
        // delegates to AuthenticationProvider -> UserDetailsService + PasswordEncoder
        Authentication authResult = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authResult.getPrincipal();
        User user = userDetails.getUser();

        String token = jwtUtil.generateToken(userDetails);

        return new LoginResponse(
                user.getId(),
                user.getFirstName(),
                user.getEmail(),
                user.getRole().name(),
                token
        );
    }
}
