package com.ticketsystem.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    private Long id;

    @NotBlank
    private String subject;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Comment> comments = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    // Optional linkage to an external Issue entity/system
    @Column(name = "issue_id")
    private Long issueId;

    // Constructors
    public Ticket() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = Status.OPEN;
        this.priority = Priority.MEDIUM;
    }

    public Ticket(String subject, String description, Priority priority, User owner) {
        this();
        this.subject = subject;
        this.description = description;
        this.priority = priority;
        this.owner = owner;
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
    public void setStatus(Status status) { 
        this.status = status; 
        this.updatedAt = LocalDateTime.now();
        if (status == Status.RESOLVED || status == Status.CLOSED) {
            this.resolvedAt = LocalDateTime.now();
        }
    }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public User getAssignee() { return assignee; }
    public void setAssignee(User assignee) { 
        this.assignee = assignee; 
        this.updatedAt = LocalDateTime.now();
    }

    public List<Comment> getComments() { return comments; }
    public void setComments(List<Comment> comments) { this.comments = comments; }

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

    // Helper methods
    public void addComment(Comment comment) {
        comments.add(comment);
        comment.setTicket(this);
    }

    public boolean canTransitionTo(Status newStatus) {
        switch (this.status) {
            case OPEN:
                return newStatus == Status.IN_PROGRESS || newStatus == Status.CLOSED;
            case IN_PROGRESS:
                return newStatus == Status.RESOLVED || newStatus == Status.CLOSED;
            case RESOLVED:
                return newStatus == Status.CLOSED;
            case CLOSED:
                return false;
            default:
                return false;
        }
    }
}
