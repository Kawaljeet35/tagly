package com.tagly.app.repository;

import com.tagly.app.entity.Like;
import com.tagly.app.entity.Post;
import com.tagly.app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserAndPost(User user, Post post);
    List<Like> findByPostUserOrderByIdDesc(User user);
}
