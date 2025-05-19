package com.husks.backend.dtos;

import java.math.BigDecimal;

public record DetalleResponseDTO(
        String producto,
        Integer cantidad,
        BigDecimal precioUnitario,
        BigDecimal subtotal
) {}