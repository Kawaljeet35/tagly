package com.tagly.app.repository;

import com.tagly.app.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    // Fetch all notifications, including clicked ones.
    List<Notification> findByRecipient_IdOrderByCreatedAtDesc(
            Long recipientId
    );

    // Count only notifications that are neither seen nor clicked.
    long countByRecipient_IdAndHasBeenSeenFalseAndHasBeenClickedFalse(
            Long recipientId
    );

    boolean existsByRecipient_IdAndTypeAndSourceEventId(
            Long recipientId,
            String type,
            Long sourceEventId
    );

    long deleteByHasBeenSeenTrueAndCreatedAtBefore(
            LocalDateTime cutoff
    );
}