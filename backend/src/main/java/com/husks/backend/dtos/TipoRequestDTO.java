package com.husks.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TipoRequestDTO(
        @NotBlank(message = "El nombre del tipo es obligatorio")
        @Size(max = 20, message = "Máximo 20 caracteres")
        String nombre
) {}
