package com.husks.backend.auth;

import com.husks.backend.entities.Usuario;
import com.husks.backend.enums.Rol;
import com.husks.backend.jwt.JwtService;
import com.husks.backend.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getNombre(), request.getContrasenia())
        );
        UserDetails usuario = usuarioRepository.findByNombre(request.getNombre()).orElseThrow();
        String token=jwtService.getToken(usuario);
        return AuthResponse.builder()
                .token(token)
                .build();
    }

    public AuthResponse register(RegisterRequest  request){
        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .contrasenia(request.getContrasenia())
                .email(request.getEmail())
                .rol(Rol.admin)
                .build();

        usuarioRepository.save(usuario);

        return AuthResponse.builder()
                .token(jwtService.getToken(usuario))
                .build();
    }
}
