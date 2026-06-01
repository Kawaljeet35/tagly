package com.tagly.app.controller;

import com.tagly.app.entity.FriendRequest;
import com.tagly.app.service.FriendRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
public class FriendRequestController {

    private final FriendRequestService friendRequestService;

    public FriendRequestController(FriendRequestService friendRequestService) {
        this.friendRequestService = friendRequestService;
    }

    @PostMapping("/request/{receiverId}")
    public ResponseEntity<String> sendRequest(@PathVariable Long receiverId) {

        String senderUsername = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        friendRequestService.sendRequest(senderUsername, receiverId);

        return ResponseEntity.ok("Request sent");
    }

    @GetMapping("/requests")
    public ResponseEntity<List<FriendRequest>> getPendingRequests() {

        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return ResponseEntity.ok(
                friendRequestService.getPendingRequests(username)
        );
    }

    @PutMapping("/accept/{requestId}")
    public ResponseEntity<String> acceptRequest(@PathVariable Long requestId) {

        friendRequestService.acceptRequest(requestId);

        return ResponseEntity.ok("Friend request accepted");
    }

    @GetMapping("/all")
    public ResponseEntity<List<FriendRequest>> getFriends() {

        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return ResponseEntity.ok(
                friendRequestService.getFriends(username)
        );
    }

    @GetMapping("/status/{userId}")
    public ResponseEntity<String> getFriendshipStatus(
            @PathVariable Long userId
    ) {

        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return ResponseEntity.ok(
                friendRequestService.getFriendshipStatus(
                        username,
                        userId
                )
        );
    }

}
