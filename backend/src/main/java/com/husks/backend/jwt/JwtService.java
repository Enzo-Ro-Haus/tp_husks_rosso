package com.husks.backend.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import com.husks.backend.entities.Usuario;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    // Clave secreta codificada en Base64 para firmar y verificar los tokens JWT
    private static final String SECRET_KEY = "E7q+T3u9K2pHdMz9VvY5sR8cN4xQe1aJb0W2n6ZrYx8=";

    // Convierte la clave secreta en un objeto Key, que se usará para
    // firmar/verificar el token
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY); // Decodificamos la clave
        return Keys.hmacShaKeyFor(keyBytes); // Creamos una clave HMAC-SHA con los bytes
    }

    public String generateToken(UserDetails user) {
        Map<String, Object> claims = new HashMap<>();

        // Si es Usuario (tu clase), agregamos el rol como claim personalizado
        if (user instanceof Usuario u) {
            claims.put("role", u.getRol()); // Se incluye el rol en el JWT
        }

        // Usamos JJWT para crear el token
        return Jwts.builder()
                .setClaims(claims) // Agregamos los claims personalizados
                .setSubject(user.getUsername()) // El "subject" será el email del usuario
                .setIssuedAt(new Date()) // Fecha de emisión (ahora)
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // Expira en 24h
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Firmamos con clave secreta del usuario
                .compact(); // Compactamos y generamos el token JWT

        // Hasta acá la generacion del token
    }

    // Valida que el token está en tiempo y forma para el usuario
    public boolean isTokenValid(String token, Usuario user) {
        final String username = extractUsername(token);
        return username.equals(user.getUsername()) && !isTokenExpired(token);
    }

    // Extrae el username del usuario que en nuestro caso es el email
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("rol", String.class));
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        final Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return resolver.apply(claims);
    }
    
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extrae las claims y revisa que si el token está expirado
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

}
