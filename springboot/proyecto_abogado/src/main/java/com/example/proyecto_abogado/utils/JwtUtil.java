package com.example.proyecto_abogado.utils;

import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${security.jwt.secret}")
    private String key;

    @Value("${security.jwt.issuer}")
    private String issuer;

    @Value("${security.jwt.ttlMillis}")
    private long ttlMillis;

    private final Logger log = LoggerFactory.getLogger(JwtUtil.class);

    public String create(String id, String subject) {
        // Verifica que la clave no sea nula o vacía
        if (key == null || key.isEmpty()) {
            throw new IllegalArgumentException("La clave secreta JWT no está configurada correctamente.");
        }

        // El algoritmo que estamos usando para firmar el token
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);

        byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(key);
        Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());

        JwtBuilder builder = Jwts.builder().setId(id).setIssuedAt(now).setSubject(subject).setIssuer(issuer)
                .signWith(signatureAlgorithm, signingKey);

        if (ttlMillis >= 0) {
            long expMillis = nowMillis + ttlMillis;
            Date exp = new Date(expMillis);
            builder.setExpiration(exp);
        }

        return builder.compact();
    }

    public Claims extractClaims(String jwt) {
        try {
            return Jwts.parser()
                    .setSigningKey(DatatypeConverter.parseBase64Binary(key))
                    .parseClaimsJws(jwt)
                    .getBody();
        } catch (ExpiredJwtException e) {
            log.error("El token ha expirado.");
            throw new JwtException("El token ha expirado", e);
        } catch (JwtException e) {
            log.error("Token JWT inválido.");
            throw new JwtException("Token JWT inválido", e);
        }
    }

    public boolean validateToken(String token, String username) {
        try {
            // Obtén los claims del token (detalles como el username y la fecha de expiración)
            final Claims claims = getClaims(token);

            // Extrae el nombre de usuario del token
            final String extractedUsername = claims.getSubject();

            // Verifica si el username coincide y si el token no ha expirado
            if (!extractedUsername.equals(username)) {
                log.error("El nombre de usuario del token no coincide con el nombre de usuario proporcionado.");
                return false;
            }

            // Verifica si el token ha expirado
            if (claims.getExpiration().before(new Date())) {
                log.error("Token expirado.");
                return false;
            }

            // Si tienes un "Issuer", verifica que coincida
            final String issuer = claims.getIssuer();
            if (!"Main".equals(issuer)) {  // Cambia "Main" al emisor que uses
                log.error("Token con emisor inválido.");
                return false;
            }

            return true;  // Si pasa todas las verificaciones
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Token JWT inválido o mal formado: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Obtiene todos los claims del JWT.
     */
    public Claims getClaims(String jwt) {
        return Jwts.parser()
                .setSigningKey(DatatypeConverter.parseBase64Binary(key))
                .parseClaimsJws(jwt)
                .getBody();
    }

    /**
     * Obtiene el sujeto (subject) del JWT.
     */
    public String getValue(String jwt) {
        Claims claims = getClaims(jwt);
        return claims.getSubject();
    }

    /**
     * Obtiene el ID del JWT.
     */
    public String getKey(String jwt) {
        Claims claims = getClaims(jwt);
        return claims.getId();
    }
}