package com.tagly.app.controller;

import com.tagly.app.dto.PostResponse;
import com.tagly.app.entity.Comment;
import com.tagly.app.entity.Like;
import com.tagly.app.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService){
        this.postService = postService;
    }

    @GetMapping
    public List<PostResponse> getPosts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        List<PostResponse> posts = postService.getAllPosts(userName);
        return posts;
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long postId
    ) {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        postService.deletePost(
                postId,
                username
        );

        return ResponseEntity.ok("Post deleted");
    }

    @PostMapping
    public ResponseEntity<String> createPost(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "content", required = false) String content
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();

        postService.createPost(content, userName, file);

        return ResponseEntity.ok("Post created");
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<String> toggleLike(@PathVariable Long postId) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        postService.toggleLike(postId, username);

        return ResponseEntity.ok("Toggled like");
    }

    @PostMapping("/{postId}/comment")
    public ResponseEntity<?> addComment(
            @PathVariable Long postId,
            @RequestBody String content
    ) {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        postService.addComment(
                postId,
                username,
                content
        );

        return ResponseEntity.ok("Comment added");
    }

    @GetMapping("/notifications/likes")
    public ResponseEntity<List<Like>>
    getLikeNotifications() {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return ResponseEntity.ok(
                postService.getLikesForUserPosts(
                        username
                )
        );
    }

    @GetMapping("/notifications/comments")
    public ResponseEntity<List<Comment>>
    getCommentNotifications() {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return ResponseEntity.ok(
                postService.getCommentsForUserPosts(
                        username
                )
        );
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<Comment>> getComments(
            @PathVariable Long postId
    ) {

        return ResponseEntity.ok(
                postService.getCommentsByPost(postId)
        );
    }

    @PutMapping("/{postId}")
    public ResponseEntity<?> editPost(
            @PathVariable Long postId,
            @RequestBody java.util.Map<String, String> body
    ) {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        String content = body.get("content");

        postService.editPost(
                postId,
                username,
                content
        );

        return ResponseEntity.ok("Post updated");
    }


}
