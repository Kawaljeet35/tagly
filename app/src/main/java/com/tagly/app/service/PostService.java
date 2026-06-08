package com.tagly.app.service;

import com.tagly.app.dto.PostResponse;
import com.tagly.app.entity.Like;
import com.tagly.app.entity.Post;
import com.tagly.app.entity.User;
import com.tagly.app.entity.FriendRequest;
import com.tagly.app.entity.Comment;
import com.tagly.app.repository.*;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
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
    private final MinioClient minioClient;
    private final FriendRequestRepository friendRequestRepository;
    private final CommentRepository commentRepository;

    public PostService(UserRepository userRepository, PostRepository postRepository, LikeRepository likeRepository, MinioClient minioClient, FriendRequestRepository friendRequestRepository, CommentRepository commentRepository){
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.likeRepository = likeRepository;
        this.minioClient = minioClient;
        this.friendRequestRepository = friendRequestRepository;
        this.commentRepository = commentRepository;
    }

    public void createPost(String content, String username, MultipartFile file){
        Optional<User> user = userRepository.findByUsername(username);
        String mediaUrl = null;
        String mediaType = null;

        if (file != null && !file.isEmpty() && file.getContentType() != null) {

            mediaType = file.getContentType().startsWith("image") ? "image" : "video";

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

                mediaUrl = "http://127.0.0.1:9000/tagly-posts/" + fileName;

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
                .findByPostUserOrderByIdDesc(user);
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
                .findByPostUserOrderByCreatedAtDesc(
                        user
                );
    }
}
