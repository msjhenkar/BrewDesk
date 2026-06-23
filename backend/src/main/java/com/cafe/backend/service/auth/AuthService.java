package com.cafe.backend.service.auth;

import com.cafe.backend.dtos.auth.LoginRequest;
import com.cafe.backend.dtos.auth.LoginResponse;
import com.cafe.backend.dtos.auth.RegisterRequest;
import com.cafe.backend.dtos.auth.RegisterResponse;

public interface AuthService {
    RegisterResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);


}
