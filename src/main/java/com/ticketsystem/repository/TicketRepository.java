package com.ticketsystem.repository;

import com.ticketsystem.model.Priority;
import com.ticketsystem.model.Status;
import com.ticketsystem.model.Ticket;
import com.ticketsystem.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
    // Find tickets by owner
    Page<Ticket> findByOwner(User owner, Pageable pageable);
    
    // Find tickets by assignee
    Page<Ticket> findByAssignee(User assignee, Pageable pageable);
    
    // Find tickets by status
    Page<Ticket> findByStatus(Status status, Pageable pageable);
    
    // Find tickets by priority
    Page<Ticket> findByPriority(Priority priority, Pageable pageable);
    
    // Find tickets by owner and status
    Page<Ticket> findByOwnerAndStatus(User owner, Status status, Pageable pageable);
    
    // Find tickets by owner and priority
    Page<Ticket> findByOwnerAndPriority(User owner, Priority priority, Pageable pageable);
    
    // Find tickets by assignee and status
    Page<Ticket> findByAssigneeAndStatus(User assignee, Status status, Pageable pageable);
    
    // Search tickets by subject or description
    @Query("SELECT t FROM Ticket t WHERE " +
           "LOWER(t.subject) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Ticket> searchTickets(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Find tickets by owner with search
    @Query("SELECT t FROM Ticket t WHERE t.owner = :owner AND " +
           "(LOWER(t.subject) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Ticket> searchTicketsByOwner(@Param("owner") User owner, 
                                     @Param("searchTerm") String searchTerm, 
                                     Pageable pageable);
    
    // Find tickets by assignee with search
    @Query("SELECT t FROM Ticket t WHERE t.assignee = :assignee AND " +
           "(LOWER(t.subject) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Ticket> searchTicketsByAssignee(@Param("assignee") User assignee, 
                                        @Param("searchTerm") String searchTerm, 
                                        Pageable pageable);
    
    // Count tickets by status for dashboard
    long countByStatus(Status status);
    
    // Count tickets by owner and status
    long countByOwnerAndStatus(User owner, Status status);
    
    // Count tickets by assignee and status
    long countByAssigneeAndStatus(User assignee, Status status);
}
