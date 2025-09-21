package com.ticketsystem.controller;

import com.ticketsystem.dto.UserDto;
import com.ticketsystem.dto.TicketDto;
import com.ticketsystem.model.*;
import com.ticketsystem.service.TicketService;
import com.ticketsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private TicketService ticketService;

    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userService.findAll();
        List<UserDto> userDtos = users.stream()
                .map(this::convertToUserDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        try {
            User user = userService.createUser(
                    request.getUsername(),
                    request.getPassword(),
                    request.getFullName(),
                    request.getEmail(),
                    request.getRole()
            );
            return ResponseEntity.ok(convertToUserDto(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody RoleUpdateRequest request) {
        try {
            User user = userService.findById(id).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            user.setRole(request.getRole());
            User updatedUser = userService.save(user);
            return ResponseEntity.ok(convertToUserDto(updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            if (!userService.existsById(id)) {
                return ResponseEntity.notFound().build();
            }

            userService.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Ticket Management
    @GetMapping("/tickets")
    public ResponseEntity<Page<TicketDto>> getAllTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Priority priority) {
        
        Pageable pageable = PageRequest.of(page, size);
        
        Page<Ticket> tickets;
        if (search != null && !search.trim().isEmpty()) {
            tickets = ticketService.searchTickets(search, pageable);
        } else if (status != null) {
            tickets = ticketService.findByStatus(status, pageable);
        } else if (priority != null) {
            tickets = ticketService.findByPriority(priority, pageable);
        } else {
            tickets = ticketService.findAll(pageable);
        }

        Page<TicketDto> ticketDtos = tickets.map(this::convertToTicketDto);
        return ResponseEntity.ok(ticketDtos);
    }

    @PutMapping("/tickets/{id}/assign")
    public ResponseEntity<?> assignTicket(@PathVariable Long id, @RequestBody AssignTicketRequest request) {
        try {
            Ticket ticket = ticketService.findById(id).orElse(null);
            if (ticket == null) {
                return ResponseEntity.notFound().build();
            }

            User assignee = userService.findById(request.getAssigneeId()).orElse(null);
            if (assignee == null) {
                return ResponseEntity.badRequest().body("Assignee not found");
            }

            // Only support agents can be assigned tickets
            if (assignee.getRole() != Role.SUPPORT_AGENT) {
                return ResponseEntity.badRequest().body("Only support agents can be assigned tickets");
            }

            Ticket updatedTicket = ticketService.assignTicket(ticket, assignee);
            return ResponseEntity.ok(convertToTicketDto(updatedTicket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/tickets/{id}/force-status")
    public ResponseEntity<?> forceUpdateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        try {
            Ticket ticket = ticketService.findById(id).orElse(null);
            if (ticket == null) {
                return ResponseEntity.notFound().build();
            }

            // Admin can force any status transition
            ticket.setStatus(request.getStatus());
            Ticket updatedTicket = ticketService.save(ticket);
            return ResponseEntity.ok(convertToTicketDto(updatedTicket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        
        stats.setTotalTickets(ticketService.countByStatus(null));
        stats.setOpenTickets(ticketService.countByStatus(Status.OPEN));
        stats.setInProgressTickets(ticketService.countByStatus(Status.IN_PROGRESS));
        stats.setResolvedTickets(ticketService.countByStatus(Status.RESOLVED));
        stats.setClosedTickets(ticketService.countByStatus(Status.CLOSED));
        stats.setTotalUsers(userService.findAll().size());
        
        return ResponseEntity.ok(stats);
    }

    // Helper methods
    private UserDto convertToUserDto(User user) {
        return new UserDto(user.getId(), user.getUsername(), user.getFullName(), user.getEmail(), user.getRole());
    }

    private TicketDto convertToTicketDto(Ticket ticket) {
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
        
        return dto;
    }

    // Inner classes for requests and responses
    public static class CreateUserRequest {
        private String username;
        private String password;
        private String fullName;
        private String email;
        private Role role;

        // Getters and Setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }
    }

    public static class RoleUpdateRequest {
        private Role role;

        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }
    }

    public static class AssignTicketRequest {
        private Long assigneeId;

        public Long getAssigneeId() { return assigneeId; }
        public void setAssigneeId(Long assigneeId) { this.assigneeId = assigneeId; }
    }

    public static class StatusUpdateRequest {
        private Status status;

        public Status getStatus() { return status; }
        public void setStatus(Status status) { this.status = status; }
    }

    public static class DashboardStats {
        private long totalTickets;
        private long openTickets;
        private long inProgressTickets;
        private long resolvedTickets;
        private long closedTickets;
        private long totalUsers;

        // Getters and Setters
        public long getTotalTickets() { return totalTickets; }
        public void setTotalTickets(long totalTickets) { this.totalTickets = totalTickets; }

        public long getOpenTickets() { return openTickets; }
        public void setOpenTickets(long openTickets) { this.openTickets = openTickets; }

        public long getInProgressTickets() { return inProgressTickets; }
        public void setInProgressTickets(long inProgressTickets) { this.inProgressTickets = inProgressTickets; }

        public long getResolvedTickets() { return resolvedTickets; }
        public void setResolvedTickets(long resolvedTickets) { this.resolvedTickets = resolvedTickets; }

        public long getClosedTickets() { return closedTickets; }
        public void setClosedTickets(long closedTickets) { this.closedTickets = closedTickets; }

        public long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    }
}
