package com.husks.backend.mapper;

import com.husks.backend.dtos.*;
import com.husks.backend.entities.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface DetalleMapper {

    @Mapping(target = "producto", source = "productoId")
    Detalle toEntity(DetalleRequestDTO dto);

    @Mapping(target = "producto", source = "producto.nombre")
    @Mapping(target = "precioUnitario", source = "producto.precio")
    @Mapping(target = "subtotal", expression = "java(detalle.getProducto().getPrecio().multiply(BigDecimal.valueOf(detalle.getCantidad())))")
    DetalleResponseDTO toResponseDto(Detalle detalle);

    default Producto mapProducto(Long productoId) {
        return Producto.builder().id(productoId).build();
    }
}