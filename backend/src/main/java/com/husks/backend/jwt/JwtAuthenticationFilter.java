package com.husks.backend.jwt;

import java.io.IOException;
import java.util.Optional;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.husks.backend.entities.Usuario;
import com.husks.backend.repositories.UsuarioRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

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

        if(request.getServletPath().contains("/public")){
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        System.out.println("🔍 AUTH HEADER: " + authHeader);
        
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            System.out.println("❌ No auth header or invalid format");
            filterChain.doFilter(request, response);
            return;
        }

        final String jwtToken = authHeader.substring(7);
        final String userEmail = jwtService.extractUsername(jwtToken);
        System.out.println("🔍 USER EMAIL: " + userEmail);

        if(userEmail == null || SecurityContextHolder.getContext().getAuthentication() != null){
            System.out.println("❌ No user email or already authenticated");
            filterChain.doFilter(request, response);
            return;
        }

        //comprobación de expiración ANTES de ir a BD 
        if (jwtService.isTokenExpired(jwtToken)) {
            System.out.println("❌ Token expired");
            filterChain.doFilter(request, response);
            return;
        }

        // Ahora que sabemos que no expiró, cargamos el UserDetails
        final UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
        System.out.println("🔍 USER DETAILS: " + userDetails.getUsername());
        System.out.println("🔍 AUTHORITIES: " + userDetails.getAuthorities());

        final Optional<Usuario> usuario = usuarioRepository.findByEmail(userDetails.getUsername());
        if(usuario.isEmpty()){
            System.out.println("❌ Usuario not found in DB");
            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("🔍 USUARIO ROL: " + usuario.get().getRol());

        // Validamos la firma y demás claims
        final boolean isTokenValid = jwtService.isTokenValid(jwtToken, usuario.get());
        if(!isTokenValid){
            System.out.println("❌ Token not valid");
            filterChain.doFilter(request, response);
            return;
        }

        // Autenticamos al usuario en el contexto de Spring
        final var authToken = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
        System.out.println("✅ Authentication set in context");

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        String method = request.getMethod();
        // Ignorar GET públicos (NO excluir /producto)
        return method.equals("GET") && (
            path.startsWith("/categoria") ||
            path.startsWith("/tipo") ||
            path.startsWith("/talle") ||
            path.equals("/error")
        );
    }
}
