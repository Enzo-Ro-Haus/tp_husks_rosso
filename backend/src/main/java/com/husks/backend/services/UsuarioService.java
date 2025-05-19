package com.husks.backend.services;

import com.husks.backend.dtos.*;

import java.util.List;

public interface UsuarioService {
    UsuarioResponseDTO registrarUsuario(UsuarioRequestDTO dto);
    UsuarioResponseDTO actualizarUsuario(Long id, UsuarioRequestDTO dto);
    UsuarioResponseDTO obtenerUsuarioPorId(Long id);
    void desactivarUsuario(Long id);
    void agregarDireccion(Long usuarioId, DireccionRequestDTO dto);
    List<OrdenCompraResponseDTO> obtenerHistorialCompras(Long usuarioId);
}
