package com.tagly.app.security;

import com.tagly.app.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Optional;

import com.tagly.app.entity.User;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    private final UserRepository userRepository;

    public JwtFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            try {
                Long userId = jwtUtil.extractUserId(token);

                Optional<User> user = userRepository.findById(userId);

                if (user.isEmpty()) {
                    response.setStatus(
                            HttpServletResponse.SC_UNAUTHORIZED
                    );
                    return;
                }

                User ourUser = user.get();

                if ("DEACTIVATED".equals(ourUser.getAccountStatus())
                        || "DELETED".equals(ourUser.getAccountStatus())) {
                    response.setStatus(
                            HttpServletResponse.SC_UNAUTHORIZED
                    );
                    return;
                }

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                ourUser.getUsername(),
                                null,
                                new ArrayList<>()
                        );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authToken);

            } catch (Exception e) {
                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
