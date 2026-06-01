package com.tagly.app.controller;

import com.tagly.app.dto.ApiResponse;
import com.tagly.app.dto.AuthResponse;
import com.tagly.app.dto.LoginRequest;
import com.tagly.app.dto.RegisterRequest;
import com.tagly.app.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody @Valid RegisterRequest request) {
        authService.register(request);
        ApiResponse response = new ApiResponse(
                "User registered successfully",
                200,
                LocalDateTime.now().toString()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {

        AuthResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }




}
