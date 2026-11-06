
package com.tagly.app.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "notifications",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_notification_recipient_type_source",
                        columnNames = {
                                "recipient_id",
                                "type",
                                "source_event_id"
                        }
                )
        },
        indexes = {
                @Index(
                        name = "idx_notification_recipient_seen_created",
                        columnList = "recipient_id, has_been_seen, created_at"
                ),
                @Index(
                        name = "idx_notification_recipient_clicked_created",
                        columnList = "recipient_id, has_been_clicked, created_at"
                )
        }
)
public class Notification {

    public Notification() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User who receives this notification.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    // User who triggered this notification.
    // Nullable to support system-generated notifications if needed.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id")
    private User actor;

    // POST_LIKE, COMMENT, REPLY, COMMENT_LIKE,
    // REPLY_LIKE, FRIEND_REQUEST
    @Column(name = "type", nullable = false, length = 40)
    private String type;

    // Navigation references. These are stored as IDs rather
    // than entity relationships so notification history
    // can survive deletion of the original post/comment.
    @Column(name = "post_id")
    private Long postId;

    @Column(name = "post_owner_id")
    private Long postOwnerId;

    @Column(name = "comment_id")
    private Long commentId;

    @Column(name = "parent_comment_id")
    private Long parentCommentId;

    // ID of the original event that generated this notification.
    // Used to prevent duplicate notifications.
    @Column(name = "source_event_id", nullable = false)
    private Long sourceEventId;

    @Column(name = "has_been_seen", nullable = false)
    private boolean hasBeenSeen = false;

    @Column(name = "has_been_clicked", nullable = false)
    private boolean hasBeenClicked = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getRecipient() {
        return recipient;
    }

    public void setRecipient(User recipient) {
        this.recipient = recipient;
    }

    public User getActor() {
        return actor;
    }

    public void setActor(User actor) {
        this.actor = actor;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public Long getPostOwnerId() {
        return postOwnerId;
    }

    public void setPostOwnerId(Long postOwnerId) {
        this.postOwnerId = postOwnerId;
    }

    public Long getCommentId() {
        return commentId;
    }

    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }

    public Long getParentCommentId() {
        return parentCommentId;
    }

    public void setParentCommentId(Long parentCommentId) {
        this.parentCommentId = parentCommentId;
    }

    public Long getSourceEventId() {
        return sourceEventId;
    }

    public void setSourceEventId(Long sourceEventId) {
        this.sourceEventId = sourceEventId;
    }

    public boolean isHasBeenSeen() {
        return hasBeenSeen;
    }

    public void setHasBeenSeen(boolean hasBeenSeen) {
        this.hasBeenSeen = hasBeenSeen;
    }

    public boolean isHasBeenClicked() {
        return hasBeenClicked;
    }

    public void setHasBeenClicked(boolean hasBeenClicked) {
        this.hasBeenClicked = hasBeenClicked;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
