package com.tagly.app.repository;

import com.tagly.app.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import com.tagly.app.entity.User;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserOrderByCreatedAtDesc(User user);
    List<Post> findAllByOrderByCreatedAtDesc();
    List<Post> findByUserInOrderByCreatedAtDesc(
            List<User> users
    );
}
