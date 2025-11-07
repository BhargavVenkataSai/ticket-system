package com.ticketsystem.dto;

import com.ticketsystem.model.Priority;
import com.ticketsystem.model.Status;

import java.time.LocalDateTime;
import java.util.List;

public class TicketDto {
    private Long id;
    private String subject;
    private String description;
    private Priority priority;
    private Status status;
    private UserDto owner;
    private UserDto assignee;
    private List<CommentDto> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private Integer rating;
    private String feedback;
    private Long issueId;

    // Constructors
    public TicketDto() {}

    public TicketDto(Long id, String subject, String description, Priority priority, 
                    Status status, UserDto owner, UserDto assignee) {
        this.id = id;
        this.subject = subject;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.owner = owner;
        this.assignee = assignee;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public UserDto getOwner() { return owner; }
    public void setOwner(UserDto owner) { this.owner = owner; }

    public UserDto getAssignee() { return assignee; }
    public void setAssignee(UserDto assignee) { this.assignee = assignee; }

    public List<CommentDto> getComments() { return comments; }
    public void setComments(List<CommentDto> comments) { this.comments = comments; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public Long getIssueId() { return issueId; }
    public void setIssueId(Long issueId) { this.issueId = issueId; }
}
