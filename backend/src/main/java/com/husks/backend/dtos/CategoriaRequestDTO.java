package com.husks.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CategoriaRequestDTO(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotNull(message = "El tipo es requerido")
        Long tipoId
) {}