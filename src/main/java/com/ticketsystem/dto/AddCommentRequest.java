package com.ticketsystem.dto;

import jakarta.validation.constraints.NotBlank;

public class AddCommentRequest {
    @NotBlank(message = "Comment content is required")
    private String content;

    // Constructors
    public AddCommentRequest() {}

    public AddCommentRequest(String content) {
        this.content = content;
    }

    // Getters and Setters
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
