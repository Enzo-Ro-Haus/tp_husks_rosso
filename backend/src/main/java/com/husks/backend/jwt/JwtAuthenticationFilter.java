package com.husks.backend.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.husks.backend.entities.Usuario;
import com.husks.backend.repositories.UsuarioRepository;

import java.io.IOException;
import java.util.Optional;

import org.springframework.http.HttpHeaders;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        System.out.println("🔍 PATH: " + path);

        // Omite las rutas públicas 
        if(request.getServletPath().contains("/public")){
            filterChain.doFilter(request, response);
            return;
        }

        //Revizamos la autorizacion que viene en el header
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }

        //Obtenemos token sin el bearer
        final String jwtToken = authHeader.substring(7);
        //Obtenemos el email del usuario
        final String userEmail = jwtService.extractUsername(jwtToken);

        // Revisamos si es nulo o si no hay nadie autentificado actualmente
        if(userEmail == null || SecurityContextHolder.getContext().getAuthentication() != null){
            filterChain.doFilter(request, response);
            return;
        }

        //Tomo el token de la request 
        if (jwtToken == null) {
            filterChain.doFilter(request, response);
            return;
        }

        //Falta si está expirado o no es válido. 

        //Obtenemos al usuario 
        final UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

        final Optional<Usuario> usuario = usuarioRepository.findByEmail(userDetails.getUsername());
        
        // Si el usuario no está en la base
        if(usuario.isEmpty()){
            filterChain.doFilter(request, response);
            return;
        }

        // Si el token es valido para el usuario
        final boolean isTokenValid = jwtService.isTokenValid(jwtToken, usuario.get());
        if(!isTokenValid){
            filterChain.doFilter(request, response);
            return;
        }

        //Autentificamos al usuario en el contexto de spring
        final var authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
