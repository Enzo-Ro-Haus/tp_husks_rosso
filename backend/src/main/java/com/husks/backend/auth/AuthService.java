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
import org.springframework.security.core.userdetails.UsernameNotFoundException;

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
        System.out.println("[INFO] Intento de registro para: " + request.getEmail());
        var usuarioOpt = usuarioRepository.findByEmail(request.getEmail());
        Usuario usuario;
        if (usuarioOpt.isPresent()) {
            usuario = usuarioOpt.get();
            if (usuario.isActivo()) {
                System.out.println("[WARN] Registro fallido, email en uso: " + usuario.getEmail());
                throw new RuntimeException("El email ya está en uso.");
            } else if (usuario.getRol() != null && usuario.getRol().name().equals("ADMIN")) {
                System.out.println("[WARN] Registro fallido, intento de restaurar ADMIN: " + usuario.getEmail());
                throw new RuntimeException("No permitido registrar o restaurar un usuario ADMIN");
            } else {
                System.out.println("[INFO] Reactivando usuario inactivo: " + usuario.getEmail());
                usuario.setNombre(request.getNombre());
                usuario.setPassword(passwordEncoder.encode(request.getPassword()));
                usuario.setRol(com.husks.backend.enums.Rol.CLIENTE);
                usuario.setImagenPerfilPublicId(request.getImagenPerfilPublicId() != null ? request.getImagenPerfilPublicId() : "user_img");
                usuario.setActivo(true);
                usuario = usuarioRepository.save(usuario);
            }
        } else {
            System.out.println("[INFO] Registrando nuevo usuario: " + request.getEmail());
            usuario = Usuario.builder()
                    .nombre(request.getNombre())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .rol(com.husks.backend.enums.Rol.CLIENTE)
                    .imagenPerfilPublicId(request.getImagenPerfilPublicId() != null ? request.getImagenPerfilPublicId() : "user_img")
                    .build();
            usuario.setActivo(true);
            usuario = usuarioRepository.save(usuario);
        }
        
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
        System.out.println("[INFO] Intento de login para: " + request.getEmail());
        var usuarioOpt = usuarioRepository.findByEmail(request.getEmail());
        if (usuarioOpt.isEmpty() || !usuarioOpt.get().isActivo()) {
            System.out.println("[WARN] Login fallido: cuenta no registrada o inactiva para " + request.getEmail());
            throw new RuntimeException("Cuenta no registrada");
        }
        var usuario = usuarioOpt.get();
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
                )
            );
        } catch (Exception e) {
            System.out.println("[WARN] Login fallido: contraseña incorrecta para " + request.getEmail());
            throw new RuntimeException("Contraseña incorrecta");
        }
        System.out.println("[INFO] Login exitoso para: " + usuario.getEmail());
        var jwtToken = jwtService.generateToken(usuario);
        return AuthResponse.builder()
                .token(jwtToken)
                .usuario(usuario)
                .build();
    }
}
