package com.tagly.app.controller;

import com.tagly.app.dto.InboxItemDTO;
import com.tagly.app.entity.Message;
import com.tagly.app.entity.User;
import com.tagly.app.dto.InboxItemDTO;
import com.tagly.app.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/{receiverId}")
    public ResponseEntity<String> sendMessage(
            @PathVariable Long receiverId,
            @RequestBody String content
    ) {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        messageService.sendMessage(
                username,
                receiverId,
                content
        );

        return ResponseEntity.ok("Message sent");
    }

    @GetMapping("/{otherUserId}")
    public ResponseEntity<List<Message>>
    getConversation(
            @PathVariable Long otherUserId
    ) {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return ResponseEntity.ok(
                messageService.getConversation(
                        username,
                        otherUserId
                )
        );
    }

    @GetMapping("/inbox")
    public ResponseEntity<List<InboxItemDTO>>
    getInbox() {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return ResponseEntity.ok(
                messageService.getConversationUsers(
                        username
                )
        );
    }

    @PutMapping("/read/{otherUserId}")
    public ResponseEntity<String> markConversationAsRead(
            @PathVariable Long otherUserId
    ) {

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        messageService.markConversationAsRead(
                username,
                otherUserId
        );

        return ResponseEntity.ok(
                "Conversation marked as read"
        );
    }
}
