package com.tagly.app.dto;

import com.tagly.app.entity.User;

public class MessageParticipantResponse {

    private Long id;
    private String username;
    private String name;
    private String profilePictureUrl;
    private String accountStatus;

    public MessageParticipantResponse(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.name = user.getName();
        this.profilePictureUrl = user.getProfilePictureUrl();
        this.accountStatus = user.getAccountStatus();
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getName() {
        return name;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public String getAccountStatus() {
        return accountStatus;
    }
}