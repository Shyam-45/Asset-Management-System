package security;

import com.typesafe.config.Config;

import enums.RoleType;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import jakarta.inject.Inject;
import jakarta.inject.Singleton;

import java.security.Key;
import java.util.Date;

@Singleton
public class JwtService {

    private static final long EXPIRATION_TIME = 1000L * 60 * 60 * 24;
    private final Key key;

    @Inject
    public JwtService(Config config) {

        String secret = config.getString("jwt.secret");
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(Long userId, RoleType role) {

        return Jwts.builder().setSubject(userId.toString()).claim("role", role.name()).setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)).signWith(key, SignatureAlgorithm.HS256).compact();
    }

    public Long extractUserId(String token) {

        Claims claims = extractAllClaims(token);
        return Long.valueOf(claims.getSubject());
    }

    public String extractRole(String token) {

        Claims claims = extractAllClaims(token);
        return claims.get("role", String.class);
    }

    public boolean validateToken(String token) {

        try {
            Claims claims = extractAllClaims(token);
            // Validate subject
            Long.valueOf(claims.getSubject());
            // Validate role
            RoleType.valueOf(claims.get("role", String.class));
            return true;
        } catch (JwtException | IllegalArgumentException | NullPointerException ex) {
            return false;
        }
    }

    private Claims extractAllClaims(String token) {

        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }
}