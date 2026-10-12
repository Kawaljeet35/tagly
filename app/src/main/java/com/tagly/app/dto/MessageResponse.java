package com.tagly.app.dto;

import com.tagly.app.entity.Message;

import java.time.LocalDateTime;

public class MessageResponse {

    private Long id;
    private MessageParticipantResponse sender;
    private MessageParticipantResponse receiver;
    private String content;
    private boolean read;
    private String imageUrl;
    private LocalDateTime createdAt;

    public MessageResponse(Message message) {
        this.id = message.getId();

        this.sender = message.getSender() == null
                ? null
                : new MessageParticipantResponse(message.getSender());

        this.receiver = message.getReceiver() == null
                ? null
                : new MessageParticipantResponse(message.getReceiver());

        this.content = message.getContent();
        this.read = message.isRead();
        this.imageUrl = message.getImageUrl();
        this.createdAt = message.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public MessageParticipantResponse getSender() {
        return sender;
    }

    public MessageParticipantResponse getReceiver() {
        return receiver;
    }

    public String getContent() {
        return content;
    }

    public boolean isRead() {
        return read;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}