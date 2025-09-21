package com.ticketsystem.controller;

import com.ticketsystem.dto.UserDto;
import com.ticketsystem.model.Role;
import com.ticketsystem.model.User;
import com.ticketsystem.security.JwtTokenProvider;
import com.ticketsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            // Simple hardcoded authentication for admin user
            if ("admin".equals(loginRequest.getUsername()) && "admin123".equals(loginRequest.getPassword())) {
                // Create a proper UserDetails object
                org.springframework.security.core.userdetails.UserDetails userDetails = 
                    org.springframework.security.core.userdetails.User.builder()
                        .username("admin")
                        .password("admin123")
                        .roles("ADMIN")
                        .build();
                
                // Create a simple authentication object
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, 
                    "admin123", 
                    userDetails.getAuthorities()
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);
                String jwt = tokenProvider.generateToken(authentication);

                // Create UserDto
                UserDto userDto = new UserDto(1L, "admin", "Administrator", "admin@example.com", Role.ADMIN);

                Map<String, Object> body = new HashMap<>();
                body.put("token", jwt);
                body.put("user", userDto);

                return ResponseEntity.ok(body);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
        } catch (Exception e) {
            // Non-auth error → 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.createUser(
                    registerRequest.getUsername(),
                    registerRequest.getPassword(),
                    registerRequest.getFullName(),
                    registerRequest.getEmail(),
                    Role.USER
            );
            UserDto userDto = new UserDto(user.getId(), user.getUsername(), user.getFullName(), user.getEmail(), user.getRole());
            return ResponseEntity.ok(userDto);
        } catch (RuntimeException e) {
            // Duplicate username, validation, etc.
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed");
        }
    }

    // Request DTOs
    public static class LoginRequest {
        private String username;
        private String password;
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String username;
        private String password;
        private String fullName;
        private String email;
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}
