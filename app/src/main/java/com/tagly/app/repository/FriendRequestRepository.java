package com.tagly.app.repository;

import com.tagly.app.entity.FriendRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import com.tagly.app.entity.User;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    Optional<FriendRequest> findBySenderAndReceiver(User sender, User receiver);
    List<FriendRequest> findByReceiverAndStatus(User receiver, String status);
    Optional<FriendRequest> findById(Long id);
    Optional<FriendRequest> findByReceiverAndSender(User receiver, User sender);
    List<FriendRequest> findBySenderAndStatus(User sender, String status);
}
