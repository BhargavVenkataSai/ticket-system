package com.ticketsystem.dto;

import java.time.LocalDateTime;

public class CommentDto {
    private Long id;
    private String content;
    private UserDto user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public CommentDto() {}

    public CommentDto(Long id, String content, UserDto user, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.content = content;
        this.user = user;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
