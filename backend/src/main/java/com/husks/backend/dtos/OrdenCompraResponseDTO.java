package com.husks.backend.dtos;

import com.husks.backend.enums.*;
import java.math.*;
import java.time.*;
import java.util.List;

public record OrdenCompraResponseDTO(
        Long id,
        LocalDate fecha,
        BigDecimal total,
        MetodoPago metodoPago,
        EstadoOrden estado,
        List<DetalleResponseDTO> detalles
) {}