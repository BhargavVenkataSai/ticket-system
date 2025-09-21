// src/main/java/com/ticketsystem/config/SecurityConfig.java
package com.ticketsystem.config;

import com.ticketsystem.security.CustomUserDetailsService;
import com.ticketsystem.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  private final CustomUserDetailsService userDetailsService;
  private final JwtAuthenticationFilter jwtAuthenticationFilter;

  public SecurityConfig(CustomUserDetailsService uds, JwtAuthenticationFilter jaf) {
    this.userDetailsService = uds;
    this.jwtAuthenticationFilter = jaf;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
      .cors(c -> c.configurationSource(corsConfigurationSource()))
      .csrf(csrf -> csrf.disable())
      .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .exceptionHandling(e -> e
        .authenticationEntryPoint((req,res,ex) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED))
        .accessDeniedHandler((req,res,ex) -> res.sendError(HttpServletResponse.SC_FORBIDDEN))
      )
      .authorizeHttpRequests(auth -> auth
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .requestMatchers("/api/auth/login").permitAll()       // explicit
        .requestMatchers("/api/auth/**").permitAll()
        .requestMatchers("/api/users/register").permitAll()
        .requestMatchers("/actuator/health").permitAll()
        .requestMatchers("/", "/index.html", "/favicon.ico").permitAll()
        .requestMatchers(new AntPathRequestMatcher("/css/**")).permitAll()
        .requestMatchers(new AntPathRequestMatcher("/js/**")).permitAll()
        .requestMatchers(new AntPathRequestMatcher("/images/**")).permitAll()
        .anyRequest().authenticated()
      )
      .authenticationProvider(authenticationProvider());

    http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    http.headers(h -> h.frameOptions(fr -> fr.sameOrigin()));
    return http.build();
  }

  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
    var p = new DaoAuthenticationProvider();
    p.setUserDetailsService(userDetailsService);
    p.setPasswordEncoder(passwordEncoder());
    return p;
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration ac) throws Exception {
    return ac.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return NoOpPasswordEncoder.getInstance();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    var cfg = new CorsConfiguration();
    cfg.setAllowedOriginPatterns(List.of("*"));
    cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS","PATCH"));
    cfg.setAllowedHeaders(List.of("*"));
    cfg.setAllowCredentials(false);
    var src = new UrlBasedCorsConfigurationSource();
    src.registerCorsConfiguration("/**", cfg);
    return src;
  }
}
