package com.tagly.app.service;

import com.tagly.app.config.MinioProperties;
import com.tagly.app.entity.User;
import com.tagly.app.entity.Message;
import com.tagly.app.repository.MessageRepository;
import com.tagly.app.repository.UserRepository;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

import com.tagly.app.dto.InboxItemDTO;
import org.springframework.web.multipart.MultipartFile;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final S3Client s3Client;
    private final MinioProperties minioProperties;

    public MessageService(
            MessageRepository messageRepository,
            UserRepository userRepository,
            S3Client s3Client,
            MinioProperties minioProperties
    ) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.s3Client = s3Client;
        this.minioProperties = minioProperties;
    }

    public void sendMessage(
            String senderUsername,
            Long receiverId,
            String content,
            MultipartFile file
    ) {

        User sender = userRepository
                .findByUsername(senderUsername)
                .orElseThrow(() ->
                        new RuntimeException("Sender not found")
                );

        User receiver = userRepository
                .findById(receiverId)
                .orElseThrow(() ->
                        new RuntimeException("Receiver not found")
                );

        Message message = new Message();

        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setCreatedAt(LocalDateTime.now());
        message.setRead(false);

        String imageUrl = null;

        if (file != null &&
                !file.isEmpty() &&
                file.getContentType() != null &&
                file.getContentType().startsWith("image")) {

            String fileName =
                    System.currentTimeMillis()
                            + "_"
                            + file.getOriginalFilename();

            try {

                PutObjectRequest putObjectRequest =
                        PutObjectRequest.builder()
                                .bucket(minioProperties.getBucket())
                                .key(fileName)
                                .contentType(file.getContentType())
                                .build();

                s3Client.putObject(
                        putObjectRequest,
                        RequestBody.fromInputStream(
                                file.getInputStream(),
                                file.getSize()
                        )
                );

                imageUrl =
                        "https://paqfjtztcsowsxbwwvqh.supabase.co/storage/v1/object/public/"
                                + minioProperties.getBucket()
                                + "/"
                                + fileName;

            } catch (Exception e) {
                throw new RuntimeException(
                        "Error uploading image",
                        e
                );
            }
        }
        message.setImageUrl(imageUrl);

        messageRepository.save(message);
    }

    public void markConversationAsRead(
            String currentUsername,
            Long otherUserId
    ) {

        User currentUser = userRepository
                .findByUsername(currentUsername)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        User otherUser = userRepository
                .findById(otherUserId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        List<Message> unreadMessages =
                messageRepository
                        .findBySenderAndReceiverAndReadFalse(
                                otherUser,
                                currentUser
                        );

        for (Message message : unreadMessages) {
            message.setRead(true);
        }

        messageRepository.saveAll(
                unreadMessages
        );
    }

    public List<Message> getConversation(
            String currentUsername,
            Long otherUserId
    ) {

        User currentUser = userRepository
                .findByUsername(currentUsername)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        User otherUser = userRepository
                .findById(otherUserId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return messageRepository
                .findBySenderAndReceiverOrReceiverAndSenderOrderByCreatedAtAsc(
                        currentUser,
                        otherUser,
                        currentUser,
                        otherUser
                );
    }

    public List<InboxItemDTO> getConversationUsers(
            String username
    ) {

        User currentUser = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        List<Message> messages =
                messageRepository.findBySenderOrReceiver(
                        currentUser,
                        currentUser
                );

        Map<Long, InboxItemDTO> inboxMap = new LinkedHashMap<>();
        for (Message message : messages) {

            User otherUser;

            if (
                    message.getSender()
                            .getId()
                            .equals(currentUser.getId())
            ) {

                otherUser = message.getReceiver();

            } else {

                otherUser = message.getSender();
            }

            if (
                    otherUser.getId()
                            .equals(currentUser.getId())
            ) {
                continue;
            }

            InboxItemDTO dto =
                    new InboxItemDTO();

            dto.setUserId(
                    otherUser.getId()
            );

            dto.setName(
                    otherUser.getName()
            );

            dto.setLatestMessage(
                    message.getContent()
            );

            dto.setLatestSenderUsername(
                    message.getSender()
                            .getUsername()
            );

            dto.setLatestMessageTime(
                    message.getCreatedAt()
            );
            if (
                    message.getReceiver()
                            .getId()
                            .equals(currentUser.getId())
                            &&
                            !message.isRead()
            ) {

                dto.setHasUnreadMessages(
                        true
                );
            }
            inboxMap.put(
                    otherUser.getId(),
                    dto
            );
        }

        List<InboxItemDTO> inboxItems =
                new ArrayList<>(
                        inboxMap.values()
                );

        inboxItems.sort(
                (a, b) -> b.getLatestMessageTime()
                        .compareTo(
                                a.getLatestMessageTime()
                        )
        );

        return inboxItems;
    }
}
