package com.tagly.app.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateProfileRequest {

    @NotBlank
    private String name;

    private String bio;

    private String location;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}