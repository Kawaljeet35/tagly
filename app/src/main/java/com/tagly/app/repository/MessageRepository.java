package com.tagly.app.repository;
import com.tagly.app.entity.Message;
import com.tagly.app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderAndReceiverOrReceiverAndSenderOrderByCreatedAtAsc(
            User sender,
            User receiver,
            User receiver2,
            User sender2
    );
    List<Message> findBySenderOrReceiver(
            User sender,
            User receiver
    );
    List<Message> findBySenderAndReceiverAndReadFalse(
            User sender,
            User receiver
    );
}
