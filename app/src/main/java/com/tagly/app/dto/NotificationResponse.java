package com.tagly.app.dto;

import com.tagly.app.entity.Notification;

import java.time.LocalDateTime;

public class NotificationResponse {

    private Long id;
    private Long actorId;
    private String actorName;
    private String actorUsername;
    private String actorProfilePictureUrl;
    private String type;
    private Long postId;
    private Long postOwnerId;
    private Long commentId;
    private Long parentCommentId;
    private boolean hasBeenSeen;
    private boolean hasBeenClicked;
    private LocalDateTime createdAt;

    public NotificationResponse(Notification notification) {
        this.id = notification.getId();

        if (notification.getActor() != null) {
            this.actorId = notification.getActor().getId();
            this.actorName = notification.getActor().getName();
            this.actorUsername = notification.getActor().getUsername();
            this.actorProfilePictureUrl =
                    notification.getActor().getProfilePictureUrl();
        }

        this.type = notification.getType();
        this.postId = notification.getPostId();
        this.postOwnerId = notification.getPostOwnerId();
        this.commentId = notification.getCommentId();
        this.parentCommentId = notification.getParentCommentId();
        this.hasBeenSeen = notification.isHasBeenSeen();
        this.hasBeenClicked = notification.isHasBeenClicked();
        this.createdAt = notification.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public Long getActorId() {
        return actorId;
    }

    public String getActorName() {
        return actorName;
    }

    public String getActorUsername() {
        return actorUsername;
    }

    public String getActorProfilePictureUrl() {
        return actorProfilePictureUrl;
    }

    public String getType() {
        return type;
    }

    public Long getPostId() {
        return postId;
    }

    public Long getPostOwnerId() {
        return postOwnerId;
    }

    public Long getCommentId() {
        return commentId;
    }

    public Long getParentCommentId() {
        return parentCommentId;
    }

    public boolean isHasBeenSeen() {
        return hasBeenSeen;
    }

    public boolean isHasBeenClicked() {
        return hasBeenClicked;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}