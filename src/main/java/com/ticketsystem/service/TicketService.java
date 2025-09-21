package com.ticketsystem.service;

import com.ticketsystem.dto.CreateTicketRequest;
import com.ticketsystem.model.*;
import com.ticketsystem.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    public Ticket createTicket(CreateTicketRequest request, User owner) {
        Ticket ticket = new Ticket(request.getSubject(), request.getDescription(), request.getPriority(), owner);
        return ticketRepository.save(ticket);
    }

    public Optional<Ticket> findById(Long id) {
        return ticketRepository.findById(id);
    }

    public Page<Ticket> findByOwner(User owner, Pageable pageable) {
        return ticketRepository.findByOwner(owner, pageable);
    }

    public Page<Ticket> findByOwnerAndStatus(User owner, Status status, Pageable pageable) {
        return ticketRepository.findByOwnerAndStatus(owner, status, pageable);
    }

    public Page<Ticket> findByOwnerAndPriority(User owner, Priority priority, Pageable pageable) {
        return ticketRepository.findByOwnerAndPriority(owner, priority, pageable);
    }

    public Page<Ticket> findByAssignee(User assignee, Pageable pageable) {
        return ticketRepository.findByAssignee(assignee, pageable);
    }

    public Page<Ticket> findByStatus(Status status, Pageable pageable) {
        return ticketRepository.findByStatus(status, pageable);
    }

    public Page<Ticket> findByPriority(Priority priority, Pageable pageable) {
        return ticketRepository.findByPriority(priority, pageable);
    }

    public Page<Ticket> searchTickets(String searchTerm, Pageable pageable) {
        return ticketRepository.searchTickets(searchTerm, pageable);
    }

    public Page<Ticket> searchTicketsByOwner(User owner, String searchTerm, Pageable pageable) {
        return ticketRepository.searchTicketsByOwner(owner, searchTerm, pageable);
    }

    public Page<Ticket> searchTicketsByAssignee(User assignee, String searchTerm, Pageable pageable) {
        return ticketRepository.searchTicketsByAssignee(assignee, searchTerm, pageable);
    }

    public Ticket updateTicketStatus(Ticket ticket, Status newStatus) {
        if (ticket.canTransitionTo(newStatus)) {
            ticket.setStatus(newStatus);
            return ticketRepository.save(ticket);
        } else {
            throw new IllegalStateException("Cannot transition ticket from " + ticket.getStatus() + " to " + newStatus);
        }
    }

    public Ticket assignTicket(Ticket ticket, User assignee) {
        ticket.setAssignee(assignee);
        if (ticket.getStatus() == Status.OPEN) {
            ticket.setStatus(Status.IN_PROGRESS);
        }
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicketPriority(Ticket ticket, Priority newPriority) {
        ticket.setPriority(newPriority);
        return ticketRepository.save(ticket);
    }

    public Ticket rateTicket(Ticket ticket, Integer rating, String feedback) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        ticket.setRating(rating);
        ticket.setFeedback(feedback);
        return ticketRepository.save(ticket);
    }

    public long countByStatus(Status status) {
        return ticketRepository.countByStatus(status);
    }

    public long countByOwnerAndStatus(User owner, Status status) {
        return ticketRepository.countByOwnerAndStatus(owner, status);
    }

    public long countByAssigneeAndStatus(User assignee, Status status) {
        return ticketRepository.countByAssigneeAndStatus(assignee, status);
    }

    public List<Ticket> findAll() {
        return ticketRepository.findAll();
    }

    public Page<Ticket> findAll(Pageable pageable) {
        return ticketRepository.findAll(pageable);
    }

    public Ticket save(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    public void deleteById(Long id) {
        ticketRepository.deleteById(id);
    }
}
