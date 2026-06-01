package com.tagly.app.dto;

import java.time.LocalDateTime;

public class InboxItemDTO {
    private Long userId;

    private String name;

    private String latestMessage;

    private String latestSenderUsername;

    private LocalDateTime latestMessageTime;

    private boolean hasUnreadMessages;

    public boolean isHasUnreadMessages() {
        return hasUnreadMessages;
    }

    public void setHasUnreadMessages(boolean hasUnreadMessages) {
        this.hasUnreadMessages = hasUnreadMessages;
    }

    public InboxItemDTO() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLatestSenderUsername() {
        return latestSenderUsername;
    }

    public void setLatestSenderUsername(String latestSenderUsername) {
        this.latestSenderUsername = latestSenderUsername;
    }

    public String getLatestMessage() {
        return latestMessage;
    }

    public void setLatestMessage(String latestMessage) {
        this.latestMessage = latestMessage;
    }

    public LocalDateTime getLatestMessageTime() {
        return latestMessageTime;
    }

    public void setLatestMessageTime(LocalDateTime latestMessageTime) {
        this.latestMessageTime = latestMessageTime;
    }
}
