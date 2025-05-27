package com.husks.backend.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Builder
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    //private String username;
    private String nombre;
    private String contrasenia;
    private String email;
    private String rol;
}
