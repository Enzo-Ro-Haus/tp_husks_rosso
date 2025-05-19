package com.husks.backend.services;

import com.husks.backend.dtos.*;
import org.springframework.data.domain.*;

import java.math.*;
import java.util.*;

public interface ProductoService {
    ProductoResponseDTO crearProducto(ProductoRequestDTO productoDTO);
    ProductoResponseDTO actualizarProducto(Long id, ProductoRequestDTO productoDTO);
    ProductoResponseDTO obtenerProductoPorId(Long id);
    List<ProductoResponseDTO> listarTodosProductos();
    Page<ProductoResponseDTO> listarProductosPaginados(Pageable pageable);
    void eliminarProducto(Long id);
    List<ProductoResponseDTO> buscarPorCategoria(Long categoriaId);
    List<ProductoResponseDTO> filtrarPorPrecio(BigDecimal precioMin, BigDecimal precioMax);
}