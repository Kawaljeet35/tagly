package com.tagly.app.controller;

import com.tagly.app.dto.NotificationResponse;
import com.tagly.app.entity.User;
import com.tagly.app.repository.UserRepository;
import com.tagly.app.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(
            NotificationService notificationService,
            UserRepository userRepository
    ) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    private Long getAuthenticatedUserId() {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalStateException("Authenticated user not found.")
                );

        return user.getId();
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications() {
        Long userId = getAuthenticatedUserId();

        return ResponseEntity.ok(
                notificationService.getNotifications(userId)
        );
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount() {
        Long userId = getAuthenticatedUserId();

        return ResponseEntity.ok(
                notificationService.getUnreadNotificationCount(userId)
        );
    }

    @PutMapping("/seen")
    public ResponseEntity<String> markNotificationsAsSeen(
            @RequestParam LocalDateTime openedAt
    ) {
        Long userId = getAuthenticatedUserId();

        notificationService.markNotificationsAsSeen(
                userId,
                openedAt
        );

        return ResponseEntity.ok("Notifications marked as seen");
    }

    @PutMapping("/{notificationId}/clicked")
    public ResponseEntity<String> markNotificationAsClicked(
            @PathVariable Long notificationId
    ) {
        Long userId = getAuthenticatedUserId();

        notificationService.markNotificationAsClicked(
                userId,
                notificationId
        );

        return ResponseEntity.ok("Notification marked as clicked");
    }
}