package com.husks.backend.auth;

import com.husks.backend.entities.Usuario;
import com.husks.backend.enums.Rol;
import com.husks.backend.jwt.JwtService;
import com.husks.backend.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        var usuario = Usuario.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .rol(Rol.CLIENTE)
                .build();
        usuario.setActivo(true);
        usuarioRepository.save(usuario);
        var jwtToken = jwtService.generateToken(usuario);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .usuario(usuario)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        var usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow();
        
        var jwtToken = jwtService.generateToken(usuario);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .usuario(usuario)
                .build();
    }
}
