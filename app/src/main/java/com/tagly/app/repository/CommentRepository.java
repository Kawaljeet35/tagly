package com.tagly.app.repository;

import com.tagly.app.entity.Comment;
import com.tagly.app.entity.Post;
import com.tagly.app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostOrderByCreatedAtAsc(Post post);
    List<Comment> findByPostUserOrderByCreatedAtDesc(User user);
    List<Comment> findByPostUserAndUserNotOrderByCreatedAtDesc(
            User postOwner,
            User user
    );
}