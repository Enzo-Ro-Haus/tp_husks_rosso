package com.husks.backend.services;


import com.husks.backend.dtos.*;

import java.util.List;

public interface TipoService {
    TipoResponseDTO crearTipo(TipoRequestDTO dto);
    TipoResponseDTO actualizarTipo(Long id, TipoRequestDTO dto);
    TipoResponseDTO obtenerTipoPorId(Long id);
    List<TipoResponseDTO> listarTodosTipos();
    void eliminarTipo(Long id);
    List<CategoriaResponseDTO> obtenerCategoriasPorTipo(Long tipoId);
}