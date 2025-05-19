package com.husks.backend.services;

import com.husks.backend.dtos.*;

import java.util.List;

public interface DetalleService {
    DetalleResponseDTO actualizarCantidad(Long detalleId, Integer nuevaCantidad);
    void eliminarDetalle(Long detalleId);
    List<DetalleResponseDTO> obtenerDetallesOrden(Long ordenId);
}