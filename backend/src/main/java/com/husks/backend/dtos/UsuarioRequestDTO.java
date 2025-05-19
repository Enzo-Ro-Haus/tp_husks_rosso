package com.husks.backend.dtos;


import com.husks.backend.enums.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioRequestDTO(
        @NotBlank(message = "Nombre obligatorio")
        @Size(max = 100, message = "Máximo 100 caracteres")
        String nombre,

        @NotBlank(message = "Email requerido")
        @Email(message = "Formato de email inválido")
        String email,

        @NotBlank(message = "Contraseña requerida")
        @Size(min = 8, max = 64, message = "La contraseña debe tener entre 8-64 caracteres")
        String contraseña,

        Rol rol
) {}