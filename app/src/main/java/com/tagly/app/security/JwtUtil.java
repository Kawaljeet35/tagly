package com.tagly.app.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    public String generateToken(String username, Long userId) {
        Key key = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );

        return Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + (24 * 60 * 60 * 1000L)
                        )
                )
                .signWith(key)
                .compact();
    }

    public Long extractUserId(String token) {
        Key key = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );

        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        Object userId = claims.get("userId");

        if (userId == null) {
            throw new IllegalArgumentException(
                    "Token does not contain a user ID"
            );
        }

        return Long.parseLong(userId.toString());
    }

    public String extractUsername(String token){
        Key key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        Claims claims = Jwts.parser().
                setSigningKey(key).
                build().
                parseClaimsJws(token).
                getBody();
        return claims.getSubject();
    }
}
