package com.husks.backend.dtos;

import com.husks.backend.enums.MetodoPago;
import jakarta.validation.constraints.*;

public record OrdenCompraRequestDTO(
        @NotNull(message = "Dirección de envío requerida")
        Long direccionId,

        @NotNull(message = "Método de pago requerido")
        MetodoPago metodoPago,

        @NotEmpty(message = "Debe incluir al menos un producto")
        List<DetalleRequestDTO> detalles
) {}