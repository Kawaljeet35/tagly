package com.tagly.app.service;

import com.tagly.app.entity.FriendRequest;
import com.tagly.app.entity.User;
import com.tagly.app.repository.FriendRequestRepository;
import com.tagly.app.repository.UserRepository;
import org.springframework.stereotype.Service;

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

        friendRequestRepository.save(request);
    }

    public List<FriendRequest> getPendingRequests(String username) {

        User receiver = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return friendRequestRepository.findByReceiverAndStatus(
                receiver,
                "PENDING"
        );
    }

    public void acceptRequest(Long requestId) {

        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus("ACCEPTED");

        friendRequestRepository.save(request);
    }

    public List<FriendRequest> getFriends(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<FriendRequest> sent =
                friendRequestRepository.findBySenderAndStatus(user, "ACCEPTED");

        List<FriendRequest> received =
                friendRequestRepository.findByReceiverAndStatus(user, "ACCEPTED");

        sent.addAll(received);

        return sent;
    }

    public String getFriendshipStatus(String currentUsername, Long userId) {

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User otherUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

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

    public void unfriend(Long friendshipId) {

        FriendRequest friendship =
                friendRequestRepository
                        .findByIdAndStatus(
                                friendshipId,
                                "ACCEPTED"
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Friendship not found"
                                )
                        );

        friendRequestRepository.delete(friendship);
    }

}
