package com.husks.backend.auth;

import com.husks.backend.entities.Usuario;
import com.husks.backend.entities.Direccion;
import com.husks.backend.entities.UsuarioDireccion;
import com.husks.backend.enums.Rol;
import com.husks.backend.jwt.JwtService;
import com.husks.backend.repositories.UsuarioRepository;
import com.husks.backend.repositories.DireccionRepository;
import com.husks.backend.repositories.UsuarioDireccionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UsuarioRepository usuarioRepository;
    private final DireccionRepository direccionRepository;
    private final UsuarioDireccionRepository usuarioDireccionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 1. Crear el usuario
        var usuario = Usuario.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .rol(Rol.CLIENTE)
                .imagenPerfilPublicId(request.getImagenPerfilPublicId() != null ? request.getImagenPerfilPublicId() : "user_img")
                .build();
        usuario.setActivo(true);
        usuario = usuarioRepository.save(usuario);
        
        // 2. Crear direcciones si existen
        if (request.getDirecciones() != null && !request.getDirecciones().isEmpty()) {
            for (DireccionRequest direccionRequest : request.getDirecciones()) {
                // Crear la dirección
                Direccion direccion = Direccion.builder()
                        .calle(direccionRequest.getCalle())
                        .localidad(direccionRequest.getLocalidad())
                        .cp(direccionRequest.getCp())
                        .build();
                direccion = direccionRepository.save(direccion);
                
                // Crear la relación usuario-dirección
                UsuarioDireccion usuarioDireccion = UsuarioDireccion.builder()
                        .usuario(usuario)
                        .direccion(direccion)
                        .build();
                usuarioDireccionRepository.save(usuarioDireccion);
            }
        }
        
        // 3. Generar token y respuesta
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
