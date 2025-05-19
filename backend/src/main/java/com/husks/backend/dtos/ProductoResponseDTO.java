 package com.husks.backend.dtos;

import java.math.BigDecimal;
import java.util.Set;

 public record ProductoResponseDTO(
         Long id,
         String nombre,
         BigDecimal precio,
         Integer cantidad,
         String descripcion,
         String color,
         String categoria,
         Set<String> talles,
         String tipoProducto
 ) {}