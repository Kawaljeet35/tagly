package com.tagly.app.service;

import com.tagly.app.dto.NotificationResponse;
import com.tagly.app.entity.Notification;
import com.tagly.app.entity.User;
import com.tagly.app.repository.NotificationRepository;
import com.tagly.app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository
    ) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    // Create a notification for an event.
    @Transactional
    public void createNotification(
            Long recipientId,
            Long actorId,
            String type,
            Long sourceEventId,
            Long postId,
            Long postOwnerId,
            Long commentId,
            Long parentCommentId
    ) {
        if (recipientId == null || sourceEventId == null
                || type == null || type.isBlank()) {
            throw new IllegalArgumentException(
                    "Recipient, notification type and source event are required."
            );
        }

        // Never create a notification for the actor's own action.
        if (actorId != null && actorId.equals(recipientId)) {
            return;
        }

        // Prevent duplicate notifications for the same event.
        if (notificationRepository.existsByRecipient_IdAndTypeAndSourceEventId(
                recipientId, type, sourceEventId
        )) {
            return;
        }

        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Notification recipient not found."
                ));

        // Do not send notifications to deleted accounts.
        if (!"ACTIVE".equals(recipient.getAccountStatus())) {
            return;
        }

        User actor = null;

        if (actorId != null) {
            actor = userRepository.findById(actorId)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Notification actor not found."
                    ));
        }

        Notification notification = new Notification();

        notification.setRecipient(recipient);
        notification.setActor(actor);
        notification.setType(type);
        notification.setSourceEventId(sourceEventId);
        notification.setPostId(postId);
        notification.setPostOwnerId(postOwnerId);
        notification.setCommentId(commentId);
        notification.setParentCommentId(parentCommentId);

        notificationRepository.save(notification);
    }

    // Retrieve all notifications, including seen and clicked ones.
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications(Long recipientId) {
        return notificationRepository
                .findByRecipient_IdOrderByCreatedAtDesc(recipientId)
                .stream()
                .map(NotificationResponse::new)
                .toList();
    }

    // Count only notifications that are neither seen nor clicked.
    @Transactional(readOnly = true)
    public long getUnreadNotificationCount(Long recipientId) {
        return notificationRepository
                .countByRecipient_IdAndHasBeenSeenFalseAndHasBeenClickedFalse(
                        recipientId
                );
    }

    // Mark notifications that existed when the popup was opened as seen.
    @Transactional
    public void markNotificationsAsSeen(
            Long recipientId,
            LocalDateTime openedAt
    ) {
        List<Notification> notifications =
                notificationRepository
                        .findByRecipient_IdOrderByCreatedAtDesc(recipientId);

        notifications.stream()
                .filter(notification -> !notification.isHasBeenSeen())
                .filter(notification ->
                        !notification.getCreatedAt().isAfter(openedAt)
                )
                .forEach(notification ->
                        notification.setHasBeenSeen(true)
                );

        notificationRepository.saveAll(notifications);
    }

    // Mark one notification as clicked without deleting or hiding it.
    @Transactional
    public void markNotificationAsClicked(
            Long recipientId,
            Long notificationId
    ) {
        notificationRepository.findById(notificationId)
                .filter(notification ->
                        notification.getRecipient().getId().equals(recipientId)
                )
                .ifPresent(notification -> {
                    notification.setHasBeenClicked(true);
                    notificationRepository.save(notification);
                });
    }

    // Delete only seen notifications older than five days.
    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public long cleanupOldSeenNotifications() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(5);

        return notificationRepository
                .deleteByHasBeenSeenTrueAndCreatedAtBefore(cutoff);
    }
}