package com.husks.backend.dtos;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.Set;

public record ProductoRequestDTO(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotNull(message = "El precio es requerido")
        @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
        BigDecimal precio,

        @NotNull(message = "La cantidad es requerida")
        @Min(value = 0, message = "La cantidad no puede ser negativa")
        Integer cantidad,

        String descripcion,

        @Size(max = 20, message = "El color no puede exceder 20 caracteres")
        String color,

        @NotNull(message = "Debe especificar una categoría")
        Long categoriaId,

        @NotEmpty(message = "Debe asignar al menos un talle")
        Set<Long> talleIds
) {}