package com.tagly.app.service;

import com.tagly.app.config.MinioProperties;
import com.tagly.app.dto.UpdateProfileRequest;
import com.tagly.app.dto.UserResponse;
import com.tagly.app.repository.UserRepository;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.tagly.app.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final S3Client s3Client;
    private final MinioProperties minioProperties;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            S3Client s3Client,
            MinioProperties minioProperties, PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.s3Client = s3Client;
        this.minioProperties = minioProperties;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse getCurrentUser(String username) {
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User ourUser = user.get();

        UserResponse response = new UserResponse();

        response.setId(ourUser.getId());
        response.setName(ourUser.getName());
        response.setUsername(ourUser.getUsername());
        response.setEmail(ourUser.getEmail());
        response.setDateOfBirth(ourUser.getDateOfBirth());
        response.setCreatedAt(ourUser.getCreatedAt());
        response.setBio(ourUser.getBio());
        response.setLocation(ourUser.getLocation());
        response.setProfilePictureUrl(ourUser.getProfilePictureUrl());
        response.setCoverPhotoUrl(ourUser.getCoverPhotoUrl());

        return response;
    }

    public void updateProfile(String username, UpdateProfileRequest request) {
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User ourUser = user.get();

        ourUser.setName(request.getName());
        ourUser.setBio(request.getBio());
        ourUser.setLocation(request.getLocation());

        userRepository.save(ourUser);
    }

    public void changePassword(
            String username,
            String currentPassword,
            String newPassword
    ) {
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        User ourUser = user.get();

        if (!passwordEncoder.matches(
                currentPassword,
                ourUser.getHashedPassword()
        )) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        if (passwordEncoder.matches(
                newPassword,
                ourUser.getHashedPassword()
        )) {
            throw new IllegalArgumentException(
                    "New password must be different from your current password"
            );
        }

        ourUser.setHashedPassword(passwordEncoder.encode(newPassword));

        userRepository.save(ourUser);
    }

    public void uploadProfilePicture(String username, MultipartFile file) {
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User ourUser = user.get();

        String fileName =
                System.currentTimeMillis() + "_" + file.getOriginalFilename();

        try {
            PutObjectRequest putObjectRequest =
                    PutObjectRequest.builder()
                            .bucket(minioProperties.getBucket())
                            .key(fileName)
                            .contentType(file.getContentType())
                            .build();

            s3Client.putObject(
                    putObjectRequest,
                    RequestBody.fromBytes(file.getBytes())
            );

            String profilePictureUrl =
                    minioProperties.getPublicUrl()
                            + "/"
                            + minioProperties.getBucket()
                            + "/"
                            + fileName;

            ourUser.setProfilePictureUrl(profilePictureUrl);

            userRepository.save(ourUser);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Error uploading profile picture",
                    e
            );
        }
    }

    public void uploadCoverPhoto(String username, MultipartFile file) {
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User ourUser = user.get();

        String fileName =
                System.currentTimeMillis() + "_cover_" + file.getOriginalFilename();

        try {
            PutObjectRequest putObjectRequest =
                    PutObjectRequest.builder()
                            .bucket(minioProperties.getBucket())
                            .key(fileName)
                            .contentType(file.getContentType())
                            .build();

            s3Client.putObject(
                    putObjectRequest,
                    RequestBody.fromBytes(file.getBytes())
            );

            String coverPhotoUrl =
                    minioProperties.getPublicUrl()
                            + "/"
                            + minioProperties.getBucket()
                            + "/"
                            + fileName;

            ourUser.setCoverPhotoUrl(coverPhotoUrl);

            userRepository.save(ourUser);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Error uploading cover photo",
                    e
            );
        }
    }

    public List<User> searchUsers(String keyword) {
        return userRepository
                .findByNameContainingIgnoreCaseOrUsernameContainingIgnoreCase(
                        keyword,
                        keyword
                );
    }
}