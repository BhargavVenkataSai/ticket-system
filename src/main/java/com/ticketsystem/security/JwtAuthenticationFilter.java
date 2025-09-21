// src/main/java/com/ticketsystem/security/JwtAuthenticationFilter.java
package com.ticketsystem.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private static final List<String> PUBLIC_PREFIXES = List.of(
      "/api/auth/", "/api/users/register", "/actuator/health",
      "/", "/css/", "/js/", "/images/"
  );

  private final JwtTokenProvider tokenProvider;
  private final UserDetailsService userDetailsService;

  public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, UserDetailsService userDetailsService) {
    this.tokenProvider = tokenProvider;
    this.userDetailsService = userDetailsService;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {

    if ("OPTIONS".equalsIgnoreCase(request.getMethod()) || isPublic(request)) {
      chain.doFilter(request, response);
      return;
    }
    if (SecurityContextHolder.getContext().getAuthentication() != null) {
      chain.doFilter(request, response);
      return;
    }

    try {
      String jwt = getJwt(request);
      if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
        String username = tokenProvider.getUsernameFromJWT(jwt);
        
        // Create UserDetails without database lookup for admin user
        UserDetails user;
        if ("admin".equals(username)) {
          user = org.springframework.security.core.userdetails.User.builder()
              .username("admin")
              .password("admin123")
              .roles("ADMIN")
              .build();
        } else {
          // For other users, try database lookup
          user = userDetailsService.loadUserByUsername(username);
        }

        var auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(auth);
      }
    } catch (Exception ignored) { }

    chain.doFilter(request, response);
  }

  private boolean isPublic(HttpServletRequest req) {
    String path = req.getRequestURI();
    for (String p : PUBLIC_PREFIXES) {
      if (path.equals(p) || path.startsWith(p)) return true;
    }
    return false;
  }

  private String getJwt(HttpServletRequest req) {
    String b = req.getHeader("Authorization");
    if (StringUtils.hasText(b) && b.startsWith("Bearer ")) return b.substring(7);
    return null;
  }
}
