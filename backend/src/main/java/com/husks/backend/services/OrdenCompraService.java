package com.husks.backend.services;

import com.husks.backend.dtos.*;
import com.husks.backend.enums.EstadoOrden;
import org.springframework.data.domain.*;

import java.math.BigDecimal;

public interface OrdenCompraService {
    OrdenCompraResponseDTO crearOrden(OrdenCompraRequestDTO dto);
    OrdenCompraResponseDTO actualizarEstadoOrden(Long id, EstadoOrden nuevoEstado);
    Page<OrdenCompraResponseDTO> listarOrdenesUsuario(Long usuarioId, Pageable pageable);
    BigDecimal calcularTotalOrden(Long ordenId);
    void cancelarOrden(Long ordenId);
}