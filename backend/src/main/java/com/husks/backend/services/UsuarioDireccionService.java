package com.husks.backend.services;

import com.husks.backend.dtos.DireccionResponseDTO;

import java.util.List;

public interface UsuarioDireccionService {
    void asociarDireccionUsuario(Long usuarioId, Long direccionId);
    void desasociarDireccionUsuario(Long usuarioId, Long direccionId);
    List<DireccionResponseDTO> obtenerDireccionesActivasUsuario(Long usuarioId);
}