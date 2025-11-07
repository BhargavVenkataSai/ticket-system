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
      "/css/", "/js/", "/images/"
  );
  
  private static final List<String> PUBLIC_EXACT_PATHS = List.of(
      "/", "/index.html", "/favicon.ico"
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

    String path = request.getRequestURI();
    String method = request.getMethod();
    System.out.println("JWT Filter: Processing request: " + method + " " + path);

    // Always allow OPTIONS requests for CORS
    if ("OPTIONS".equalsIgnoreCase(method)) {
      System.out.println("JWT Filter: Allowing OPTIONS request for CORS: " + path);
      chain.doFilter(request, response);
      return;
    }
    
    // Check if path is public (non-authenticated)
    if (isPublic(request)) {
      System.out.println("JWT Filter: Skipping public request: " + path);
      chain.doFilter(request, response);
      return;
    }
    if (SecurityContextHolder.getContext().getAuthentication() != null) {
      System.out.println("JWT Filter: Authentication already exists, skipping");
      chain.doFilter(request, response);
      return;
    }

    try {
      String jwt = getJwt(request);
      System.out.println("JWT Filter: Extracted token: " + (jwt != null ? "Token present (length: " + jwt.length() + ")" : "No token"));
      
      if (StringUtils.hasText(jwt)) {
        System.out.println("JWT Filter: Validating token...");
        if (tokenProvider.validateToken(jwt)) {
          String username = tokenProvider.getUsernameFromJWT(jwt);
          System.out.println("JWT Filter: Token valid, username: " + username);
          
          // Create UserDetails without database lookup for admin user
          UserDetails user;
          if ("admin".equals(username)) {
            System.out.println("JWT Filter: Creating admin user details");
            user = org.springframework.security.core.userdetails.User.builder()
                .username("admin")
                .password("admin123")
                .roles("ADMIN")
                .build();
          } else {
            // For other users, try database lookup
            System.out.println("JWT Filter: Loading user from database: " + username);
            try {
              user = userDetailsService.loadUserByUsername(username);
              System.out.println("JWT Filter: User loaded successfully: " + user.getUsername());
            } catch (Exception e) {
              System.err.println("JWT Filter: Failed to load user '" + username + "': " + e.getMessage());
              e.printStackTrace();
              // Don't set authentication if user lookup fails
              chain.doFilter(request, response);
              return;
            }
          }

          var auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
          auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
          SecurityContextHolder.getContext().setAuthentication(auth);
          System.out.println("JWT Filter: Authentication set successfully for user: " + username);
        } else {
          System.err.println("JWT Filter: Invalid token for request: " + path);
        }
      } else {
        System.err.println("JWT Filter: No JWT token found in request: " + path);
        System.err.println("JWT Filter: Authorization header: " + request.getHeader("Authorization"));
      }
    } catch (Exception e) {
      System.err.println("JWT Filter: Exception processing JWT: " + e.getMessage());
      e.printStackTrace();
      // Don't set authentication on error
    }

    chain.doFilter(request, response);
  }

  private boolean isPublic(HttpServletRequest req) {
    String path = req.getRequestURI();
    System.out.println("JWT Filter: Checking if path is public: " + path);
    
    // Check exact paths first
    if (PUBLIC_EXACT_PATHS.contains(path)) {
      System.out.println("JWT Filter: Path is an exact public path: " + path);
      return true;
    }
    
    // Check prefix matches
    for (String p : PUBLIC_PREFIXES) {
      if (path.startsWith(p)) {
        System.out.println("JWT Filter: Path matches public prefix: " + p);
        return true;
      }
    }
    
    System.out.println("JWT Filter: Path is NOT public, requires authentication: " + path);
    return false;
  }

  private String getJwt(HttpServletRequest req) {
    String b = req.getHeader("Authorization");
    if (StringUtils.hasText(b) && b.startsWith("Bearer ")) return b.substring(7);
    return null;
  }
}
