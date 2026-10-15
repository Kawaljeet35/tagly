package com.tagly.app.service;

import com.tagly.app.entity.FriendRequest;
import com.tagly.app.entity.User;
import com.tagly.app.repository.FriendRequestRepository;
import com.tagly.app.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FriendRequestService {

    private final FriendRequestRepository friendRequestRepository;
    private final UserRepository userRepository;

    public FriendRequestService(FriendRequestRepository friendRequestRepository,
                                UserRepository userRepository) {
        this.friendRequestRepository = friendRequestRepository;
        this.userRepository = userRepository;
    }

    public void sendRequest(String senderUsername, Long receiverId) {

        User sender = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (sender.getId().equals(receiver.getId())) {
            throw new IllegalArgumentException(
                    "You cannot send a friend request to yourself"
            );
        }

        if ("DEACTIVATED".equals(receiver.getAccountStatus())) {
            throw new IllegalArgumentException("Receiver is unavailable");
        }

        if (friendRequestRepository.findBySenderAndReceiver(sender, receiver).isPresent()) {
            throw new RuntimeException("Request already sent");
        }

        if (friendRequestRepository.findByReceiverAndSender(sender, receiver).isPresent()) {
            throw new RuntimeException("This user already sent you a request");
        }

        FriendRequest request = new FriendRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setStatus("PENDING");
        request.setCreatedAt(LocalDateTime.now());

        friendRequestRepository.save(request);
    }

    public List<FriendRequest> getPendingRequests(String username) {

        User receiver = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return friendRequestRepository.findByReceiverAndStatus(
                        receiver,
                        "PENDING"
                )
                .stream()
                .filter(request ->
                        !"DEACTIVATED".equals(
                                request.getSender().getAccountStatus()
                        )
                )
                .toList();
    }

    public void acceptRequest(Long requestId, String currentUsername) {

        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Request not found"
                ));

        if (!request.getReceiver().getUsername().equals(currentUsername)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not authorized to accept this request"
            );
        }

        if (!"PENDING".equals(request.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Request is not pending"
            );
        }

        if ("DEACTIVATED".equals(request.getSender().getAccountStatus())
                || "DEACTIVATED".equals(request.getReceiver().getAccountStatus())) {
            throw new IllegalArgumentException("Friend request is unavailable");
        }

        request.setStatus("ACCEPTED");
        friendRequestRepository.save(request);
    }

    public void declineRequest(Long requestId, String currentUsername) {

        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Request not found"
                ));

        if (!request.getReceiver().getUsername().equals(currentUsername)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not authorized to decline this request"
            );
        }

        if (!"PENDING".equals(request.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Request is not pending"
            );
        }

        friendRequestRepository.delete(request);
    }

    public List<FriendRequest> getFriends(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<FriendRequest> sent =
                friendRequestRepository.findBySenderAndStatus(user, "ACCEPTED");

        List<FriendRequest> received =
                friendRequestRepository.findByReceiverAndStatus(user, "ACCEPTED");

        sent.addAll(received);

        return sent.stream()
                .filter(request ->
                        !"DEACTIVATED".equals(
                                request.getSender().getAccountStatus()
                        )
                                && !"DEACTIVATED".equals(
                                request.getReceiver().getAccountStatus()
                        )
                )
                .toList();
    }

    public List<FriendRequest> getFriendsByUserId(
            Long userId,
            String currentUsername
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Users can always view their own friends list.
        if (!currentUser.getId().equals(userId)) {
            String friendshipStatus = getFriendshipStatus(
                    currentUsername,
                    userId
            );

            if (!"ACCEPTED".equals(friendshipStatus)) {
                throw new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.FORBIDDEN,
                        "You must be friends to view this user's friends list"
                );
            }
        }

        List<FriendRequest> sent =
                friendRequestRepository.findBySenderAndStatus(user, "ACCEPTED");

        List<FriendRequest> received =
                friendRequestRepository.findByReceiverAndStatus(user, "ACCEPTED");

        sent.addAll(received);

        return sent.stream()
                .filter(request ->
                        !"DEACTIVATED".equals(
                                request.getSender().getAccountStatus()
                        )
                                && !"DEACTIVATED".equals(
                                request.getReceiver().getAccountStatus()
                        )
                )
                .toList();
    }

    public String getFriendshipStatus(String currentUsername, Long userId) {

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User otherUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("DEACTIVATED".equals(otherUser.getAccountStatus())) {
            return "NONE";
        }

        Optional<FriendRequest> sentRequest =
                friendRequestRepository.findBySenderAndReceiver(
                        currentUser,
                        otherUser
                );

        if (sentRequest.isPresent()) {
            return sentRequest.get().getStatus();
        }

        Optional<FriendRequest> receivedRequest =
                friendRequestRepository.findByReceiverAndSender(
                        currentUser,
                        otherUser
                );

        if (receivedRequest.isPresent()) {

            if (
                    receivedRequest.get()
                            .getStatus()
                            .equals("PENDING")
            ) {
                return "RECEIVED";
            }

            return receivedRequest.get().getStatus();
        }

        return "NONE";
    }

    public void unfriend(Long friendshipId, String currentUsername) {

        FriendRequest friendship = friendRequestRepository
                .findByIdAndStatus(friendshipId, "ACCEPTED")
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Friendship not found"
                ));

        boolean isSender = friendship.getSender()
                .getUsername().equals(currentUsername);

        boolean isReceiver = friendship.getReceiver()
                .getUsername().equals(currentUsername);

        if (!isSender && !isReceiver) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not authorized to remove this friendship"
            );
        }

        friendRequestRepository.delete(friendship);
    }

}
