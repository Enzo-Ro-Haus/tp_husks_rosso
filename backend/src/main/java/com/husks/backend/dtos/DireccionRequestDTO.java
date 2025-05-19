package com.husks.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record DireccionRequestDTO(
        @NotBlank(message = "Calle requerida")
        @Size(max = 100, message = "Máximo 100 caracteres")
        String calle,

        @NotBlank(message = "Localidad requerida")
        @Size(max = 50, message = "Máximo 50 caracteres")
        String localidad,

        @NotBlank(message = "Código postal requerido")
        @Pattern(regexp = "\\d{4,10}", message = "Formato CP inválido")
        String cp
) {}