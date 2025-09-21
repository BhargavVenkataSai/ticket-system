package com.ticketsystem.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class EncoderConfig {

    public PasswordEncoder passwordEncoder() {
    // Using NoOpPasswordEncoder will store passwords in plain text.
    // NOTE: This is insecure and should only be used for testing or legacy compatibility.
    return NoOpPasswordEncoder.getInstance();
    }
}
