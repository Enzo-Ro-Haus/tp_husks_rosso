package com.husks.backend.dtos;

import jakarta.validation.constraints.NotNull;

public record UsuarioDireccionRequestDTO(
        @NotNull Long usuarioId,
        @NotNull Long direccionId
) {}