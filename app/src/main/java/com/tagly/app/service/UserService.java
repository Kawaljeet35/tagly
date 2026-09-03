package com.tagly.app.service;

import com.tagly.app.config.MinioProperties;
import com.tagly.app.dto.UserResponse;
import com.tagly.app.repository.UserRepository;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.tagly.app.entity.User;

import java.util.List;
import java.util.Optional;
import com.tagly.app.dto.UserResponse;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final S3Client s3Client;
    private final MinioProperties minioProperties;

    public UserService(UserRepository userRepository,
                       S3Client s3Client, MinioProperties minioProperties) {

        this.userRepository = userRepository;
        this.s3Client = s3Client;
        this.minioProperties = minioProperties;
    }

    public UserResponse getCurrentUser(String username) {
        Optional<User> user = userRepository.findByUsername(username);

        if(user.isEmpty()){
            throw new RuntimeException("User not found");
        }
        UserResponse response = new UserResponse();
        response.setId(user.get().getId());
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
            PutObjectRequest putObjectRequest =
                    PutObjectRequest.builder()
                            .bucket(minioProperties.getBucket())
                            .key(fileName)
                            .contentType(file.getContentType())
                            .build();

            s3Client.putObject(
                    putObjectRequest,
                    RequestBody.fromBytes(
                            file.getBytes()
                    )
            );
            String profilePictureUrl =
                    "https://paqfjtztcsowsxbwwvqh.supabase.co/storage/v1/object/public/"
                            + minioProperties.getBucket()
                            + "/"
                            + fileName;
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
