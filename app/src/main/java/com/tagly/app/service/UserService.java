package com.tagly.app.service;

import com.tagly.app.config.MinioProperties;
import com.tagly.app.dto.UpdateProfileRequest;
import com.tagly.app.dto.UserResponse;
import com.tagly.app.entity.*;
import com.tagly.app.repository.*;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Service
public class UserService {
    private static final Logger log =
            LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final FriendRequestRepository friendRequestRepository;

    private final S3Client s3Client;
    private final MinioProperties minioProperties;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PostRepository postRepository,
            CommentRepository commentRepository,
            LikeRepository likeRepository,
            CommentLikeRepository commentLikeRepository,
            FriendRequestRepository friendRequestRepository,
            S3Client s3Client,
            MinioProperties minioProperties,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.likeRepository = likeRepository;
        this.commentLikeRepository = commentLikeRepository;
        this.friendRequestRepository = friendRequestRepository;
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
                )
                .stream()
                .filter(user ->
                        !"DEACTIVATED".equals(user.getAccountStatus())
                                && !"DELETED".equals(user.getAccountStatus())
                )
                .toList();
    }

    public void deactivateAccount(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAccountStatus("DEACTIVATED");

        userRepository.save(user);
    }

    @Transactional
    public void deleteAccount(String username,  String rawPassword) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        if ("DELETED".equals(user.getAccountStatus())) {
            throw new IllegalArgumentException(
                    "Account has already been deleted"
            );
        }

        if (rawPassword == null
                || rawPassword.isBlank()
                || user.getHashedPassword() == null
                || !passwordEncoder.matches(
                rawPassword,
                user.getHashedPassword()
        )) {
            throw new IllegalArgumentException("Incorrect password");
        }

        Long userId = user.getId();

        Set<String> mediaUrlsToDelete = new LinkedHashSet<>();

        if (user.getProfilePictureUrl() != null) {
            mediaUrlsToDelete.add(user.getProfilePictureUrl());
        }

        if (user.getCoverPhotoUrl() != null) {
            mediaUrlsToDelete.add(user.getCoverPhotoUrl());
        }

        // 1. Find all posts owned by this account.
        List<Post> userPosts =
                postRepository.findByUserOrderByCreatedAtDesc(user);

        Set<Long> userPostIds = new HashSet<>();

        for (Post post : userPosts) {
            userPostIds.add(post.getId());

            if (post.getMediaUrl() != null) {
                mediaUrlsToDelete.add(post.getMediaUrl());
            }
        }

        // 2. Collect comments on the user's posts.
        // Also collect comments authored by this user elsewhere.
        // If an authored parent comment is deleted, its replies
        // must be removed first to avoid broken parent references.
        Map<Long, Comment> commentsToDelete = new LinkedHashMap<>();

        for (Post post : userPosts) {
            for (Comment comment :
                    commentRepository.findByPostOrderByCreatedAtAsc(post)) {

                commentsToDelete.put(comment.getId(), comment);
            }
        }

        List<Comment> authoredComments =
                commentRepository.findByUser(user);

        for (Comment comment : authoredComments) {

            commentsToDelete.put(comment.getId(), comment);

            if (comment.getParentComment() == null) {
                List<Comment> replies =
                        commentRepository.findByParentComment(comment);

                for (Comment reply : replies) {
                    commentsToDelete.put(reply.getId(), reply);
                }
            }
        }

        Set<Long> commentIdsToDelete =
                new HashSet<>(commentsToDelete.keySet());

        // 3. Find likes left by this user on posts belonging to others.
        Map<Long, Post> postsWithRemovedLikes = new LinkedHashMap<>();
        Map<Long, Integer> removedLikeCounts = new HashMap<>();

        List<Like> authoredLikes = likeRepository.findByUser(user);

        for (Like like : authoredLikes) {

            Post post = like.getPost();

            if (!post.getUser().getId().equals(userId)) {
                postsWithRemovedLikes.put(post.getId(), post);
                removedLikeCounts.merge(post.getId(), 1, Integer::sum);
            }
        }

        likeRepository.deleteAll(authoredLikes);

        // 4. Find comment likes left by this user on comments
        // that will remain after deletion.
        Map<Long, Comment> commentsWithRemovedLikes =
                new LinkedHashMap<>();

        Map<Long, Integer> removedCommentLikeCounts =
                new HashMap<>();

        List<CommentLike> authoredCommentLikes =
                commentLikeRepository.findByUser(user);

        for (CommentLike commentLike : authoredCommentLikes) {

            Comment comment = commentLike.getComment();

            boolean commentWillRemain =
                    !commentIdsToDelete.contains(comment.getId());

            boolean postWillRemain =
                    !userPostIds.contains(comment.getPost().getId());

            if (commentWillRemain && postWillRemain) {
                commentsWithRemovedLikes.put(
                        comment.getId(),
                        comment
                );

                removedCommentLikeCounts.merge(
                        comment.getId(),
                        1,
                        Integer::sum
                );
            }
        }

        commentLikeRepository.deleteAll(authoredCommentLikes);

        // 5. Update counts on other users' content.
        Map<Long, Post> postsWithRemovedComments =
                new LinkedHashMap<>();

        Map<Long, Integer> removedCommentCounts =
                new HashMap<>();

        for (Comment comment : commentsToDelete.values()) {

            Post post = comment.getPost();

            if (!userPostIds.contains(post.getId())) {

                postsWithRemovedComments.put(post.getId(), post);

                removedCommentCounts.merge(
                        post.getId(),
                        1,
                        Integer::sum
                );
            }
        }

        for (Map.Entry<Long, Integer> entry :
                removedLikeCounts.entrySet()) {

            Post post = postsWithRemovedLikes.get(entry.getKey());

            post.setLikesCount(
                    Math.max(
                            0,
                            post.getLikesCount() - entry.getValue()
                    )
            );
        }

        for (Map.Entry<Long, Integer> entry :
                removedCommentCounts.entrySet()) {

            Post post = postsWithRemovedComments.get(entry.getKey());

            post.setCommentsCount(
                    Math.max(
                            0,
                            post.getCommentsCount() - entry.getValue()
                    )
            );
        }

        for (Map.Entry<Long, Integer> entry :
                removedCommentLikeCounts.entrySet()) {

            Comment comment =
                    commentsWithRemovedLikes.get(entry.getKey());

            comment.setLikesCount(
                    Math.max(
                            0,
                            comment.getLikesCount() - entry.getValue()
                    )
            );
        }

        postRepository.saveAll(postsWithRemovedLikes.values());
        postRepository.saveAll(postsWithRemovedComments.values());
        commentRepository.saveAll(commentsWithRemovedLikes.values());

        // 6. Delete replies before parent comments.
        List<Comment> repliesToDelete =
                commentsToDelete.values()
                        .stream()
                        .filter(comment ->
                                comment.getParentComment() != null
                        )
                        .toList();

        List<Comment> parentCommentsToDelete =
                commentsToDelete.values()
                        .stream()
                        .filter(comment ->
                                comment.getParentComment() == null
                        )
                        .toList();

        commentRepository.deleteAll(repliesToDelete);
        commentRepository.deleteAll(parentCommentsToDelete);

        // 7. Delete remaining likes on the user's own posts.
        for (Post post : userPosts) {
            likeRepository.deleteAll(
                    likeRepository.findByPost(post)
            );
        }

        // Comments have already been removed safely.
        // Delete the user's posts.
        postRepository.deleteAll(userPosts);

        // 8. Remove friend requests and accepted friendships
        // represented by friend request records.
        friendRequestRepository.deleteAll(
                friendRequestRepository.findBySenderOrReceiver(
                        user,
                        user
                )
        );

        // 9. Anonymize the retained user row.
        // Its database ID remains unchanged for old messages.
        String suffix =
                UUID.randomUUID().toString().replace("-", "");

        user.setUsername(
                "deleted_user_" + userId + "_" + suffix
        );

        user.setName("Deleted User");

        user.setEmail(
                "deleted_" + userId + "_" + suffix + "@example.invalid"
        );

        user.setHashedPassword(
                passwordEncoder.encode(
                        UUID.randomUUID().toString()
                )
        );

        user.setDateOfBirth(LocalDate.of(1970, 1, 1));
        user.setBio(null);
        user.setLocation(null);
        user.setProfilePictureUrl(null);
        user.setCoverPhotoUrl(null);
        user.setAccountStatus("DELETED");

        userRepository.save(user);
        if (!mediaUrlsToDelete.isEmpty()) {
            List<String> urlsToDelete =
                    new ArrayList<>(mediaUrlsToDelete);

            TransactionSynchronizationManager.registerSynchronization(
                    new TransactionSynchronization() {
                        @Override
                        public void afterCommit() {
                            deleteStoredMedia(urlsToDelete);
                        }
                    }
            );
        }
    }

    private void deleteStoredMedia(List<String> mediaUrls) {

        for (String mediaUrl : mediaUrls) {

            String key = extractStorageKey(mediaUrl);

            if (key == null) {
                log.warn(
                        "Skipping media cleanup because the URL "
                                + "does not match the configured storage location"
                );
                continue;
            }

            try {
                s3Client.deleteObject(
                        DeleteObjectRequest.builder()
                                .bucket(minioProperties.getBucket())
                                .key(key)
                                .build()
                );
            } catch (Exception e) {
                log.error(
                        "Failed to delete stored media after account deletion",
                        e
                );
            }
        }
    }

    private String extractStorageKey(String mediaUrl) {

        if (mediaUrl == null || mediaUrl.isBlank()) {
            return null;
        }

        String publicUrl = minioProperties.getPublicUrl();

        if (publicUrl == null || publicUrl.isBlank()) {
            return null;
        }

        String expectedPrefix =
                publicUrl.replaceAll("/+$", "")
                        + "/"
                        + minioProperties.getBucket()
                        + "/";

        if (!mediaUrl.startsWith(expectedPrefix)) {
            return null;
        }

        String encodedKey =
                mediaUrl.substring(expectedPrefix.length());

        int queryIndex = encodedKey.indexOf('?');

        if (queryIndex >= 0) {
            encodedKey = encodedKey.substring(0, queryIndex);
        }

        int fragmentIndex = encodedKey.indexOf('#');

        if (fragmentIndex >= 0) {
            encodedKey = encodedKey.substring(0, fragmentIndex);
        }

        try {
            return URLDecoder.decode(
                    encodedKey.replace("+", "%2B"),
                    StandardCharsets.UTF_8
            );
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}