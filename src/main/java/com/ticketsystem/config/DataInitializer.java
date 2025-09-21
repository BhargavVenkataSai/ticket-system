package com.ticketsystem.config;

import com.ticketsystem.model.Role;
import com.ticketsystem.model.User;
import com.ticketsystem.service.UserService;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    private final UserService userService;

    public DataInitializer(UserService userService) {
        this.userService = userService;
    }

    @PostConstruct
    public void init() {
        if (!userService.existsByUsername("admin")) {
            userService.createUser(
                "admin",
                "admin123",   // plain password (will be encoded)
                "Administrator",
                "admin@example.com",
                Role.ADMIN
            );
            System.out.println("✅ Default admin user created: admin / admin123");
        } else {
            System.out.println("ℹ️ Admin user already exists");
        }
        System.out.println("Data initialization completed!");
    }
}
