package com.husks.backend.services;

import com.husks.backend.dtos.*;
import java.util.List;

public interface CategoriaService {
    CategoriaResponseDTO crearCategoria(CategoriaRequestDTO dto);
    CategoriaResponseDTO actualizarCategoria(Long id, CategoriaRequestDTO dto);
    List<CategoriaResponseDTO> listarCategoriasPorTipo(Long tipoId);
    List<ProductoResponseDTO> obtenerProductosPorCategoria(Long categoriaId);
}