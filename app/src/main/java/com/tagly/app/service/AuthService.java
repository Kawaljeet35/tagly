package com.tagly.app.service;

import com.tagly.app.dto.*;
import com.tagly.app.repository.UserRepository;
import com.tagly.app.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.tagly.app.entity.User;

import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setDateOfBirth(request.getDateOfBirth());

        String hashed = passwordEncoder.encode(request.getPassword());
        user.setHashedPassword(hashed);

        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request){
        Optional<User> theUser = userRepository.findByUsername(request.getUsername());
        if(theUser.isEmpty()){
            throw new IllegalArgumentException("Username does not exists");
        }

        User user = theUser.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getHashedPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        if ("DEACTIVATED".equals(user.getAccountStatus())) {
            throw new IllegalArgumentException("Account is deactivated");
        }

        String token = jwtUtil.generateToken(user.getUsername());

        return new AuthResponse(token);
    }

    public void verifyAccount(VerifyAccountRequest request) {

        Optional<User> theUser = userRepository.findByUsername(request.getUsername());

        if (theUser.isEmpty()) {
            throw new IllegalArgumentException("Account details do not match");
        }

        User user = theUser.get();

        boolean emailMatches = user.getEmail().equalsIgnoreCase(request.getEmail());
        boolean dateOfBirthMatches = user.getDateOfBirth().equals(request.getDateOfBirth());

        if (!emailMatches || !dateOfBirthMatches) {
            throw new IllegalArgumentException("Account details do not match");
        }
    }

    public void resetPassword(ResetPasswordRequest request) {

        Optional<User> theUser = userRepository.findByUsername(request.getUsername());

        if (theUser.isEmpty()) {
            throw new IllegalArgumentException("Account details do not match");
        }

        User user = theUser.get();

        boolean emailMatches = user.getEmail().equalsIgnoreCase(request.getEmail());
        boolean dateOfBirthMatches = user.getDateOfBirth().equals(request.getDateOfBirth());

        if (!emailMatches || !dateOfBirthMatches) {
            throw new IllegalArgumentException("Account details do not match");
        }

        String hashedPassword = passwordEncoder.encode(request.getNewPassword());
        user.setHashedPassword(hashedPassword);

        userRepository.save(user);
    }
}
