        package com.husks.backend.auth;

        import com.husks.backend.entities.Usuario;
        import com.husks.backend.enums.Rol;
        import com.husks.backend.jwt.JwtService;
        import com.husks.backend.repositories.UsuarioRepository;
        import lombok.RequiredArgsConstructor;
        import org.springframework.security.authentication.AuthenticationManager;
        import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
        import org.springframework.security.core.userdetails.UsernameNotFoundException;
        import org.springframework.security.crypto.password.PasswordEncoder;
        import org.springframework.stereotype.Service;

        @Service
        @RequiredArgsConstructor
        public class AuthService {

                private final UsuarioRepository usuarioRepository;
                private final JwtService jwtService;
                private final PasswordEncoder passwordEncoder;
                private final AuthenticationManager authenticationManager;

                public AuthResponse login(LoginRequest request) {

                        // Autenticamos las credenciales del usuario usando el AuthenticationManager
                        authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
                        
                        // Buscamos el usuario en la base de datos por email que autenticamos
                        Usuario usuario = usuarioRepository
                                        .findByEmail(request.getEmail())
                                        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

                        // Generamos un nuevo token JWT con la información del usuario
                        String jwt = jwtService.generateToken(usuario);

                        // Retornamos la respuesta con el token generado y los datos del usuario
                        return AuthResponse.builder()
                                        .token(jwt) // Token creado mas arriba
                                        .usuario(usuario)
                                        .build();

                        // No se guarda el token por lo que es stateless
                }

                public AuthResponse register(RegisterRequest request) {

                        
                        // Creamos el usuario
                        Usuario usuario = Usuario.builder()
                                        .nombre(request.getNombre())
                                        .password(passwordEncoder.encode(request.getPassword()))
                                        .email(request.getEmail())
                                        .rol(Rol.CLIENTE)
                                        .build();

                        // Se guarda el usuario en la bd
                        usuarioRepository.save(usuario);

                        // Generamos el token
                        String jwt = jwtService.generateToken(usuario);

                        return AuthResponse.builder()
                                        .token(jwt) // El token generado mas arriba
                                        .usuario(usuario)
                                        .build();

                        // No se guarda el token por lo que es stateless
                }
        }
