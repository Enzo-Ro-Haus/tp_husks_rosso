package com.husks.backend.services;

import com.husks.backend.dtos.*;

import java.util.List;

public interface DireccionService {
    DireccionResponseDTO crearDireccion(DireccionRequestDTO dto);
    void eliminarDireccion(Long id);
    List<DireccionResponseDTO> obtenerDireccionesUsuario(Long usuarioId);
    DireccionResponseDTO actualizarDireccion(Long id, DireccionRequestDTO dto);
}