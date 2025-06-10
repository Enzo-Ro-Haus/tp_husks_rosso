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

    private static final String SECRET_KEY="4db5b0452d845624abc08171ea3190ef650c162d8ed3294a306db8c7cf7607ac9d5c88f8";

    public String getToken(UserDetails usuario){
        return getToken(new HashMap<>(), usuario);
    }

    public String getToken(Map<String, Object> extraClaims, UserDetails user){
        if(user instanceof Usuario){
            Usuario u = (Usuario) user;
         }
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }


    public String getUserNameFromToken(String token) {
        return getClaim(token, Claims::getSubject);
    }

    public String getRoleFromToken(String token) {
        return getClaim(token, claims -> claims.get("role", String.class));
    }

    public boolean isTokenValid(String token, UserDetails userDetail) {
        final String nombre = getUserNameFromToken(token);
        return (nombre.equals(userDetail.getUsername()) && !isTokenExpire(token));
    }

    private Date getExpiration(String token){
        return getClaim(token, Claims::getExpiration);
    }

    private Boolean isTokenExpire(String token){
        return getExpiration(token).before(new Date());
    }


    private Claims getAllClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T getClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claims=getAllClaims(token);
        return claimsResolver.apply(claims);
    }
}
