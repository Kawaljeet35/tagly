package com.tagly.app.service;

import com.tagly.app.dto.UserResponse;
import com.tagly.app.repository.UserRepository;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.tagly.app.entity.User;

import java.util.List;
import java.util.Optional;
import com.tagly.app.dto.UserResponse;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final MinioClient minioClient;

    public UserService(UserRepository userRepository,
                       MinioClient minioClient) {

        this.userRepository = userRepository;
        this.minioClient = minioClient;
    }

    public UserResponse getCurrentUser(String username) {
        Optional<User> user = userRepository.findByUsername(username);

        if(user.isEmpty()){
            throw new RuntimeException("User not found");
        }
        UserResponse response = new UserResponse();
        response.setName(user.get().getName());

        response.setUsername(user.get().getUsername());

        response.setProfilePictureUrl(
                user.get().getProfilePictureUrl()
        );
        return response;
    }

    public void uploadProfilePicture(String username, MultipartFile file) {
        Optional<User> user = userRepository.findByUsername(username);
        if(user.isEmpty()){
            throw new RuntimeException("User not found");
        }
        User ourUser = user.get();
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        try {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket("tagly-posts")
                            .object(fileName)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );
            String profilePictureUrl =
                    "http://127.0.0.1:9000/tagly-posts/" + fileName;
            ourUser.setProfilePictureUrl(profilePictureUrl);
            userRepository.save(ourUser);
        } catch (Exception e) {
            throw new RuntimeException("Error uploading profile picture", e);
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
