package com.ticketsystem.service;

import com.ticketsystem.model.User;
import com.ticketsystem.repository.UserRepository;

import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Primary
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)  // ✅ use username for login
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())             // ✅ match login with DB
                .password(user.getPassword())                 // must be BCrypt encrypted
                .roles(user.getRole().name())                 // e.g. ADMIN, USER, SUPPORT_AGENT
                .build();
    }
}
