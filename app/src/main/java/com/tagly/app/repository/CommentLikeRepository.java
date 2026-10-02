package com.tagly.app.repository;

import com.tagly.app.entity.Comment;
import com.tagly.app.entity.CommentLike;
import com.tagly.app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {

    Optional<CommentLike> findByUserAndComment(
            User user,
            Comment comment
    );
}