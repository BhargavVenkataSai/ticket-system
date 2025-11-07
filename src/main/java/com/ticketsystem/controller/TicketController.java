package com.ticketsystem.controller;

import com.ticketsystem.dto.AddCommentRequest;
import com.ticketsystem.dto.CreateTicketRequest;
import com.ticketsystem.dto.TicketDto;
import com.ticketsystem.dto.UserDto;
import com.ticketsystem.dto.CommentDto;
import com.ticketsystem.model.*;
import com.ticketsystem.repository.TicketRepository;
import com.ticketsystem.service.CommentService;
import com.ticketsystem.service.TicketService;
import com.ticketsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.transaction.annotation.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.ConstraintViolationException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserService userService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private TicketRepository ticketRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<?> createTicket(@Valid @RequestBody CreateTicketRequest request) {
        try {
            User currentUser = getCurrentUser();
            Ticket ticket = ticketService.createTicket(request, currentUser);
            // Force initialization of lazy-loaded relationships within transaction
            if (ticket.getOwner() != null) {
                ticket.getOwner().getId(); // Trigger lazy loading
            }
            if (ticket.getComments() != null) {
                ticket.getComments().size(); // Trigger lazy loading
            }
            return ResponseEntity.ok(convertToDto(ticket));
        } catch (RuntimeException e) {
            e.printStackTrace(); // Log the full stack trace for debugging
            String errorMessage = e.getMessage() != null ? e.getMessage() : "Unknown error occurred";
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", errorMessage);
            errorResponse.put("details", e.getClass().getSimpleName());
            if (e.getCause() != null) {
                errorResponse.put("cause", e.getCause().getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace for debugging
            String errorMessage = e.getMessage() != null ? e.getMessage() : "Unknown error occurred";
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", errorMessage);
            errorResponse.put("details", e.getClass().getSimpleName());
            if (e.getCause() != null) {
                errorResponse.put("cause", e.getCause().getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            String fieldName = error.getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "Validation failed");
        errorResponse.put("details", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTicket(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            Ticket ticket = ticketService.findById(id).orElse(null);
            
            if (ticket == null) {
                return ResponseEntity.notFound().build();
            }

            // Check if user has access to this ticket
            if (!hasAccessToTicket(currentUser, ticket)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            return ResponseEntity.ok(convertToDto(ticket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<?> getMyTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Priority priority) {
        
        try {
            User currentUser = getCurrentUser();
            Pageable pageable = PageRequest.of(page, size);
            
            Page<Ticket> tickets;
            if (search != null && !search.trim().isEmpty()) {
                tickets = ticketService.searchTicketsByOwner(currentUser, search, pageable);
            } else if (status != null) {
                tickets = ticketService.findByOwnerAndStatus(currentUser, status, pageable);
            } else if (priority != null) {
                tickets = ticketService.findByOwnerAndPriority(currentUser, priority, pageable);
            } else {
                tickets = ticketService.findByOwner(currentUser, pageable);
            }

            Page<TicketDto> ticketDtos = tickets.map(this::convertToDto);
            return ResponseEntity.ok(ticketDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/assigned")
    public ResponseEntity<?> getAssignedTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Priority priority) {
        
        try {
            User currentUser = getCurrentUser();
            
            // Only support agents and admins can view assigned tickets
            if (currentUser.getRole() != Role.SUPPORT_AGENT && currentUser.getRole() != Role.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only support agents can view assigned tickets");
            }
            
            Pageable pageable = PageRequest.of(page, size);
            
            Page<Ticket> tickets;
            if (search != null && !search.trim().isEmpty()) {
                tickets = ticketService.searchTicketsByAssignee(currentUser, search, pageable);
            } else if (status != null) {
                tickets = ticketRepository.findByAssigneeAndStatus(currentUser, status, pageable);
            } else {
                tickets = ticketService.findByAssignee(currentUser, pageable);
            }

            Page<TicketDto> ticketDtos = tickets.map(this::convertToDto);
            return ResponseEntity.ok(ticketDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long id, @RequestBody AddCommentRequest request) {
        try {
            User currentUser = getCurrentUser();
            Ticket ticket = ticketService.findById(id).orElse(null);
            
            if (ticket == null) {
                return ResponseEntity.notFound().build();
            }

            if (!hasAccessToTicket(currentUser, ticket)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Comment comment = commentService.addComment(request, currentUser, ticket);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        try {
            User currentUser = getCurrentUser();
            Ticket ticket = ticketService.findById(id).orElse(null);
            
            if (ticket == null) {
                return ResponseEntity.notFound().build();
            }

            if (!hasAccessToTicket(currentUser, ticket)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Only support agents and admins can change status
            if (currentUser.getRole() == Role.USER && ticket.getOwner().getId().equals(currentUser.getId())) {
                // Users can only close their own tickets
                if (request.getStatus() != Status.CLOSED) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Users can only close their own tickets");
                }
            }

            Ticket updatedTicket = ticketService.updateTicketStatus(ticket, request.getStatus());
            return ResponseEntity.ok(convertToDto(updatedTicket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/priority")
    public ResponseEntity<?> updatePriority(@PathVariable Long id, @RequestBody PriorityUpdateRequest request) {
        try {
            User currentUser = getCurrentUser();
            Ticket ticket = ticketService.findById(id).orElse(null);
            
            if (ticket == null) {
                return ResponseEntity.notFound().build();
            }

            if (!hasAccessToTicket(currentUser, ticket)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Only support agents and admins can change priority
            if (currentUser.getRole() == Role.USER) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Users cannot change ticket priority");
            }

            Ticket updatedTicket = ticketService.updateTicketPriority(ticket, request.getPriority());
            return ResponseEntity.ok(convertToDto(updatedTicket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<?> rateTicket(@PathVariable Long id, @RequestBody RatingRequest request) {
        try {
            User currentUser = getCurrentUser();
            Ticket ticket = ticketService.findById(id).orElse(null);
            
            if (ticket == null) {
                return ResponseEntity.notFound().build();
            }

            // Only ticket owner can rate
            if (!ticket.getOwner().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only ticket owner can rate the ticket");
            }

            // Only resolved tickets can be rated
            if (ticket.getStatus() != Status.RESOLVED) {
                return ResponseEntity.badRequest().body("Only resolved tickets can be rated");
            }

            Ticket updatedTicket = ticketService.rateTicket(ticket, request.getRating(), request.getFeedback());
            return ResponseEntity.ok(convertToDto(updatedTicket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Helper methods
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        // Try to get user from database first (for both admin and regular users)
        Optional<User> userOpt = userService.findByUsername(username);
        if (userOpt.isPresent()) {
            return userOpt.get();
        }
        
        // If admin user doesn't exist in DB, create it (for demo purposes)
        if ("admin".equals(username)) {
            try {
                User adminUser = userService.createUser(
                    "admin", 
                    "admin123", 
                    "Administrator", 
                    "admin@example.com", 
                    Role.ADMIN
                );
                return adminUser;
            } catch (RuntimeException e) {
                // User might already exist, try to fetch again
                return userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Failed to get admin user: " + e.getMessage()));
            }
        }
        
        // For other users, they must exist in the database
        throw new RuntimeException("User not found: " + username);
    }

    private boolean hasAccessToTicket(User user, Ticket ticket) {
        return user.getRole() == Role.ADMIN || 
               user.getRole() == Role.SUPPORT_AGENT ||
               ticket.getOwner().getId().equals(user.getId()) ||
               (ticket.getAssignee() != null && ticket.getAssignee().getId().equals(user.getId()));
    }

    private TicketDto convertToDto(Ticket ticket) {
        TicketDto dto = new TicketDto(
            ticket.getId(),
            ticket.getSubject(),
            ticket.getDescription(),
            ticket.getPriority(),
            ticket.getStatus(),
            convertToUserDto(ticket.getOwner()),
            ticket.getAssignee() != null ? convertToUserDto(ticket.getAssignee()) : null
        );
        
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());
        dto.setResolvedAt(ticket.getResolvedAt());
        dto.setRating(ticket.getRating());
        dto.setFeedback(ticket.getFeedback());
        dto.setIssueId(ticket.getIssueId());
        
        // Convert comments - handle lazy loading exception
        try {
            List<CommentDto> commentDtos = ticket.getComments().stream()
                .map(this::convertToCommentDto)
                .collect(Collectors.toList());
            dto.setComments(commentDtos);
        } catch (Exception e) {
            // If lazy loading fails (e.g., LazyInitializationException), set empty list
            dto.setComments(new ArrayList<>());
        }
        
        return dto;
    }

    private UserDto convertToUserDto(User user) {
        return new UserDto(user.getId(), user.getUsername(), user.getFullName(), user.getEmail(), user.getRole());
    }

    private CommentDto convertToCommentDto(Comment comment) {
        return new CommentDto(
            comment.getId(),
            comment.getContent(),
            convertToUserDto(comment.getUser()),
            comment.getCreatedAt(),
            comment.getUpdatedAt()
        );
    }

    // Inner classes for requests
    public static class StatusUpdateRequest {
        private Status status;

        public Status getStatus() { return status; }
        public void setStatus(Status status) { this.status = status; }
    }

    public static class PriorityUpdateRequest {
        private Priority priority;

        public Priority getPriority() { return priority; }
        public void setPriority(Priority priority) { this.priority = priority; }
    }

    public static class RatingRequest {
        private Integer rating;
        private String feedback;

        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }

        public String getFeedback() { return feedback; }
        public void setFeedback(String feedback) { this.feedback = feedback; }
    }
}
