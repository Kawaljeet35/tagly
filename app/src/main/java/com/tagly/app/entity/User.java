package com.tagly.app.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;


@Entity
@Table(name = "users")
public class User {

    public User() {}

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String name;

    @JsonIgnore
    @Column(nullable = false)
    private String hashedPassword;

    @Column(nullable = false, unique = true)
    private String email;

    private String profilePictureUrl;

    @JsonIgnore
    @OneToMany(mappedBy = "sender")
    private List<FriendRequest> sentRequests;

    @JsonIgnore
    @OneToMany(mappedBy = "receiver")
    private List<FriendRequest> receivedRequests;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHashedPassword() {
        return hashedPassword;
    }

    public void setHashedPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    public List<FriendRequest> getSentRequests() {
        return sentRequests;
    }

    public void setSentRequests(List<FriendRequest> sentRequests) {
        this.sentRequests = sentRequests;
    }

    public List<FriendRequest> getReceivedRequests() {
        return receivedRequests;
    }

    public void setReceivedRequests(List<FriendRequest> receivedRequests) {
        this.receivedRequests = receivedRequests;
    }
}
