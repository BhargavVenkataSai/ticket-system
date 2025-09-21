package com.ticketsystem.security;

import com.ticketsystem.model.User;
import com.ticketsystem.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

    System.out.println("AUTH_DEBUG => username=" + user.getUsername() +
                       ", password=" + user.getPassword() +
                       ", role=" + user.getRole().name());

    return org.springframework.security.core.userdetails.User.builder()
        .username(user.getUsername())
        .password(user.getPassword()) // since NoOpPasswordEncoder, plain text is fine
        .roles(user.getRole().name())  // ✅ use .name() to get string version of enum
        .build();
    }

}
