package com.husks.backend.mapper;


import com.husks.backend.dtos.*;
import com.husks.backend.entities.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = DetalleMapper.class)
public interface OrdenCompraMapper {

    @Mapping(target = "usuarioDireccion", source = "direccionId")
    @Mapping(target = "detalles", source = "detalles")
    OrdenCompra toEntity(OrdenCompraRequestDTO dto);

    @Mapping(target = "detalles", source = "detalles")
    @Mapping(target = "total", source = "precioTotal")
    OrdenCompraResponseDTO toDto(OrdenCompra orden);

    default UsuarioDireccion mapDireccion(Long direccionId) {
        return UsuarioDireccion.builder()
                .direccion(Direccion.builder().id(direccionId).build())
                .build();
    }
}