package com.husks.backend.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.husks.backend.jwt.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final AuthenticationProvider authProvider;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable())
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .authorizeHttpRequests(req -> req
                                                .requestMatchers(HttpMethod.POST, "/public/register", "/public/login")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET,
                                                                "/producto", 
                                                                "/producto/**",
                                                                "/producto/public",
                                                                "/talle",
                                                                "/talle/**",
                                                                "/tipo",
                                                                "/tipo/**",
                                                                "/categoria",
                                                                "/categoria/**",
                                                                "/error")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/mercado").hasAnyRole("ADMIN", "CLIENTE")

                                                // USUARIO / ADMIN GET
                                                .requestMatchers(HttpMethod.GET,
                                                                "/direccion", "/direccion/**",
                                                                "/usuario/**",
                                                                "/usuario/",
                                                                "/orden-compra",
                                                                "/orden-compra/**")
                                                .hasAnyRole("ADMIN", "CLIENTE")

                                                // ADMIN POST
                                                .requestMatchers(HttpMethod.POST,
                                                                "/producto/**",
                                                                "/usuario/**",
                                                                "/talle/**",
                                                                "/categoria/**",
                                                                "/tipo/**")
                                                .hasRole("ADMIN")

                                                // ADMIN CLIENTE POST
                                                .requestMatchers(HttpMethod.POST, "/direccion/**")
                                                .hasAnyRole("ADMIN", "CLIENTE")

                                                // ADMIN USUARIO
                                                .requestMatchers(HttpMethod.POST, "/orden-compra/**")
                                                .hasAnyRole("ADMIN", "CLIENTE")

                                                // ADMIN PUT
                                                .requestMatchers(HttpMethod.PUT,
                                                                "/producto/**",
                                                                "/talle/**",
                                                                "/categoria/**",
                                                                "/tipo/**")
                                                .hasRole("ADMIN")

                                                // ADMIN USUARIO PUT
                                                .requestMatchers(HttpMethod.PUT, "/direccion/**", "/usuario/**",
                                                                "/orden-compra/**")
                                                .hasAnyRole("ADMIN", "CLIENTE")

                                                // ADMIN DELETE
                                                .requestMatchers(HttpMethod.DELETE,
                                                                "/producto/**",
                                                                "/direccion/**",
                                                                "/talle/**",
                                                                "/categoria/**",
                                                                "/tipo/**",
                                                                "/orden-compra/**")
                                                .hasRole("ADMIN")

                                                // PATCH para soft delete propio (usuario autenticado)
                                                .requestMatchers(HttpMethod.PATCH, "/usuario/me/soft-delete")
                                                .hasAnyRole("ADMIN", "CLIENTE")

                                                // ADMIN PATCH
                                                .requestMatchers(HttpMethod.PATCH,
                                                                "/usuario/soft-delete/**",
                                                                "/producto/soft-delete/**",
                                                                "/categoria/soft-delete/**",
                                                                "/tipo/soft-delete/**",
                                                                "/talle/soft-delete/**",
                                                                "/usuario-direccion/soft-delete/**")
                                                .hasAnyRole("ADMIN", "CLIENTE")

                                                .requestMatchers(HttpMethod.PATCH, "/usuario/me")
                                                .hasAnyRole("ADMIN", "CLIENTE")
                                                .requestMatchers(HttpMethod.PATCH,
                                                                "/orden-compra/soft-delete/**",
                                                                "/usuario/restore/**",
                                                                "/producto/restore/**",
                                                                "/categoria/restore/**",
                                                                "/tipo/restore/**",
                                                                "/talle/restore/**",
                                                                "/usuario-direccion/restore/**",
                                                                "/orden-compra/restore/**",
                                                                "/usuario/*/imagen-perfil",
                                                                "/usuario/*/activar",
                                                                "/usuario/*/desactivar",
                                                                "/usuario/*/corregir-rol-admin",
                                                                "/producto/*/imagen")
                                                .hasRole("ADMIN")

                                                // CLIENTE USUARIO DELETE
                                                .requestMatchers(HttpMethod.DELETE,
                                                                "/usuario")
                                                .hasAnyRole("ADMIN", "CLIENTE")

                                                // CUALQUIER OTRA REQUEST
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authProvider)
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(List.of("*"));
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                config.setAllowedHeaders(List.of("*"));
                config.setAllowCredentials(false);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", config);
                return source;
        }
}
