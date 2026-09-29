package com.tagly.app.controller;

import com.tagly.app.dto.UpdateProfileRequest;
import com.tagly.app.dto.UserResponse;
import com.tagly.app.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.tagly.app.entity.User;
import com.tagly.app.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(UserService userService, UserRepository userRepository){
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String username = auth.getName();

        return ResponseEntity.ok(
                userService.getCurrentUser(username)
        );
    }

    @PostMapping("/profile-picture")
    public ResponseEntity<String> uploadProfilePicture(
            @RequestParam("file") MultipartFile file
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String username = auth.getName();

        userService.uploadProfilePicture(username, file);

        return ResponseEntity.ok("Profile picture uploaded");
    }

    @PostMapping("/cover-photo")
    public ResponseEntity<String> uploadCoverPhoto(
            @RequestParam("file") MultipartFile file
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String username = auth.getName();

        userService.uploadCoverPhoto(username, file);

        return ResponseEntity.ok("Cover photo uploaded");
    }

    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(
            @RequestBody UpdateProfileRequest request
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String username = auth.getName();

        userService.updateProfile(username, request);

        return ResponseEntity.ok("Profile updated");
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {

        List<User> users = userRepository.findAll();

        List<UserResponse> responses = users.stream()
                .map(user -> {
                    UserResponse response = new UserResponse();

                    response.setId(user.getId());
                    response.setName(user.getName());
                    response.setUsername(user.getUsername());
                    response.setProfilePictureUrl(user.getProfilePictureUrl());
                    response.setCoverPhotoUrl(user.getCoverPhotoUrl());

                    return response;
                })
                .toList();

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        String currentUsername = auth.getName();

        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setUsername(user.getUsername());
        response.setDateOfBirth(user.getDateOfBirth());
        response.setCreatedAt(user.getCreatedAt());
        response.setBio(user.getBio());
        response.setLocation(user.getLocation());
        response.setProfilePictureUrl(user.getProfilePictureUrl());
        response.setCoverPhotoUrl(user.getCoverPhotoUrl());

        if (user.getUsername().equals(currentUsername)) {
            response.setEmail(user.getEmail());
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUsers(
            @RequestParam String keyword
    ) {
        List<User> users = userService.searchUsers(keyword);

        List<UserResponse> responses = users.stream()
                .map(user -> {
                    UserResponse response = new UserResponse();

                    response.setId(user.getId());
                    response.setName(user.getName());
                    response.setUsername(user.getUsername());
                    response.setProfilePictureUrl(user.getProfilePictureUrl());

                    return response;
                })
                .toList();

        return ResponseEntity.ok(responses);
    }
}
