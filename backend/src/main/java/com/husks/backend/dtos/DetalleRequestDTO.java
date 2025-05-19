package com.husks.backend.dtos;

import jakarta.validation.constraints.*;

public record DetalleRequestDTO(
        @NotNull(message = "Producto requerido")
        Long productoId,

        @NotNull(message = "Cantidad requerida")
        @Min(value = 1, message = "Mínimo 1 unidad")
        Integer cantidad
) {}