package com.husks.backend.dtos;

import com.husks.backend.enums.SistemaTalle;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TalleRequestDTO(
        @NotNull(message = "Sistema de talle requerido")
        SistemaTalle sistema,

        @NotBlank(message = "Valor de talle requerido")
        @Size(max = 10, message = "Máximo 10 caracteres")
        String valor
) {}