package com.husks.backend.config;

import com.husks.backend.config.CorsConfig;
import com.husks.backend.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.springframework.security.config.Customizer.withDefaults;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private  final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authProvider;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        return http
                .cors(withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth ->
                        auth
                                // Rutas públicas
                                .requestMatchers("/auth/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/public/**").permitAll() // GET público en ambas rutas

                                // Restricciones para /public/**
                                .requestMatchers(HttpMethod.POST, "/public/**").hasRole("admin")
                                .requestMatchers(HttpMethod.PUT, "/public/**").hasRole("admin")
                                .requestMatchers(HttpMethod.DELETE, "/public/**").hasRole("admin")

                                // Restricciones generales (POST, PUT, DELETE en cualquier otra ruta)
                                .requestMatchers(HttpMethod.POST, "/**").hasRole("admin")
                                .requestMatchers(HttpMethod.PUT, "/**").hasRole("admin")
                                .requestMatchers(HttpMethod.DELETE, "/**").hasRole("admin")

                                // Cualquier otra solicitud requiere autenticación
                                .anyRequest().authenticated()
                )
                .sessionManagement(sessionManagment ->
                        sessionManagment.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }



}
