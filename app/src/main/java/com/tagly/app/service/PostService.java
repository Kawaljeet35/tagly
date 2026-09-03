package com.tagly.app.service;

import com.tagly.app.config.MinioProperties;
import com.tagly.app.dto.PostResponse;
import com.tagly.app.entity.Like;
import com.tagly.app.entity.Post;
import com.tagly.app.entity.User;
import com.tagly.app.entity.FriendRequest;
import com.tagly.app.entity.Comment;
import com.tagly.app.repository.*;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    private final S3Client s3Client;
    private final FriendRequestRepository friendRequestRepository;
    private final CommentRepository commentRepository;
    private final MinioProperties minioProperties;

    public PostService(UserRepository userRepository, PostRepository postRepository, LikeRepository likeRepository, S3Client s3Client, FriendRequestRepository friendRequestRepository, CommentRepository commentRepository, MinioProperties minioProperties){
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.likeRepository = likeRepository;
        this.s3Client = s3Client;
        this.friendRequestRepository = friendRequestRepository;
        this.commentRepository = commentRepository;
        this.minioProperties = minioProperties;
    }

    public void createPost(String content, String username, MultipartFile file){
        Optional<User> user = userRepository.findByUsername(username);
        String mediaUrl = null;
        String mediaType = null;

        if (file != null && !file.isEmpty() && file.getContentType() != null) {

            mediaType = file.getContentType().startsWith("image") ? "image" : "video";

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
                        RequestBody.fromInputStream(
                                file.getInputStream(),
                                file.getSize()
                        )
                );

                mediaUrl =
                        "https://paqfjtztcsowsxbwwvqh.supabase.co/storage/v1/object/public/"
                                + minioProperties.getBucket()
                                + "/"
                                + fileName;

            } catch (Exception e) {
                throw new RuntimeException("Error uploading file", e);
            }
        }
        if(user.isPresent()){
            User ourUser = user.get();
            Post newPost = new Post();
            newPost.setUser(ourUser);
            newPost.setContent(content);
            newPost.setCreatedAt(LocalDateTime.now());
            newPost.setMediaUrl(mediaUrl);
            newPost.setMediaType(mediaType);
            postRepository.save(newPost);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public List<PostResponse> getPostsByUser(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if(user.isPresent()){
            User ourUser = user.get();
            List<Post> posts = postRepository.findByUserOrderByCreatedAtDesc(ourUser);
            List<PostResponse> responses = new ArrayList<>();
            for(Post post: posts){
                PostResponse response = new PostResponse();
                response.setId(post.getId());
                response.setContent(post.getContent());
                response.setUsername(post.getUser().getUsername());
                response.setCreatedAt(post.getCreatedAt());
                response.setLikesCount(post.getLikesCount());
                response.setCommentsCount(post.getCommentsCount());
                response.setMediaUrl(post.getMediaUrl());
                response.setMediaType(post.getMediaType());
                response.setLikedByCurrentUser(
                        likeRepository.findByUserAndPost(ourUser, post).isPresent()
                );
                responses.add(response);
            }
            return responses;
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public List<PostResponse> getAllPosts(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if(user.isPresent()){
            User ourUser = user.get();
            List<FriendRequest> sentFriends =
                    friendRequestRepository.findBySenderAndStatus(
                            ourUser,
                            "ACCEPTED"
                    );

            List<FriendRequest> receivedFriends =
                    friendRequestRepository.findByReceiverAndStatus(
                            ourUser,
                            "ACCEPTED"
                    );
            List<User> allowedUsers = new ArrayList<>();

            allowedUsers.add(ourUser);

            for (FriendRequest friend : sentFriends) {
                allowedUsers.add(friend.getReceiver());
            }

            for (FriendRequest friend : receivedFriends) {
                allowedUsers.add(friend.getSender());
            }
            List<Post> posts = postRepository.findByUserInOrderByCreatedAtDesc(allowedUsers);
            List<PostResponse> responses = new ArrayList<>();
            for(Post post: posts){
                PostResponse response = new PostResponse();
                response.setId(post.getId());
                response.setContent(post.getContent());
                response.setUsername(post.getUser().getUsername());
                response.setName(
                        post.getUser().getName() != null
                                ? post.getUser().getName()
                                : post.getUser().getUsername()
                );
                response.setCreatedAt(post.getCreatedAt());
                response.setLikesCount(post.getLikesCount());
                response.setCommentsCount(post.getCommentsCount());
                response.setMediaUrl(post.getMediaUrl());
                response.setMediaType(post.getMediaType());
                response.setLikedByCurrentUser(
                        likeRepository.findByUserAndPost(ourUser, post).isPresent()
                );
                response.setProfilePictureUrl(post.getUser().getProfilePictureUrl());
                responses.add(response);
            }
            return responses;
        } else {
            throw new RuntimeException("User not found");
        }
    }


    public void toggleLike(Long postId, String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<Post> postOpt = postRepository.findById(postId);

        if (userOpt.isEmpty() || postOpt.isEmpty()) {
            throw new RuntimeException("User or Post not found");
        }

        User user = userOpt.get();
        Post post = postOpt.get();

        Optional<Like> existingLike = likeRepository.findByUserAndPost(user, post);

        if (existingLike.isPresent()) {
            // unlike
            likeRepository.delete(existingLike.get());
            post.setLikesCount(post.getLikesCount() - 1);
        } else {
            // like
            Like like = new Like();
            like.setUser(user);
            like.setPost(post);
            like.setCreatedAt(LocalDateTime.now());
            likeRepository.save(like);
            post.setLikesCount(post.getLikesCount() + 1);
        }

        postRepository.save(post);
    }

    public void addComment(Long postId, String username, String content) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<Post> postOpt = postRepository.findById(postId);

        if (userOpt.isEmpty() || postOpt.isEmpty()) {
            throw new RuntimeException("User or Post not found");
        }

        User user = userOpt.get();
        Post post = postOpt.get();

        Comment comment = new Comment();

        comment.setUser(user);
        comment.setPost(post);
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());
        commentRepository.save(comment);
        post.setCommentsCount(post.getCommentsCount() + 1);
        postRepository.save(post);
    }

    public void deletePost(
            Long postId,
            String username
    ) {

        Optional<Post> postOpt =
                postRepository.findById(postId);

        Optional<User> userOpt =
                userRepository.findByUsername(username);

        if (postOpt.isEmpty() || userOpt.isEmpty()) {
            throw new RuntimeException("Post or User not found");
        }

        Post post = postOpt.get();
        User user = userOpt.get();

        if (!post.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        postRepository.delete(post);
    }

    public List<Comment> getCommentsByPost(
            Long postId
    ) {

        Optional<Post> postOpt =
                postRepository.findById(postId);

        if (postOpt.isEmpty()) {
            throw new RuntimeException("Post not found");
        }

        return commentRepository.findByPostOrderByCreatedAtAsc(
                postOpt.get()
        );
    }

    public void editPost(
            Long postId,
            String username,
            String content
    ) {

        Optional<Post> postOpt =
                postRepository.findById(postId);

        Optional<User> userOpt =
                userRepository.findByUsername(username);

        if (postOpt.isEmpty() || userOpt.isEmpty()) {
            throw new RuntimeException("Post or User not found");
        }

        Post post = postOpt.get();
        User user = userOpt.get();

        if (!post.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        post.setContent(content);

        postRepository.save(post);
    }

    public List<Like> getLikesForUserPosts(
            String username
    ) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return likeRepository
                .findByPostUserAndUserNotOrderByIdDesc(
                        user,
                        user
                );
    }

    public List<Comment> getCommentsForUserPosts(
            String username
    ) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return commentRepository
                .findByPostUserAndUserNotOrderByCreatedAtDesc(
                        user,
                        user
                );
    }
}
