package com.tagly.app.dto;

public class ApiResponse {
    private String message;
    private int status;
    private String timestamp;

    public ApiResponse(String message, int status, String timestamp) {
        this.message = message;
        this.status = status;
        this.timestamp = timestamp;
    }

    public String getMessage() {
        return message;
    }

    public int getStatus() {
        return status;
    }

    public String getTimestamp() {
        return timestamp;
    }
}
