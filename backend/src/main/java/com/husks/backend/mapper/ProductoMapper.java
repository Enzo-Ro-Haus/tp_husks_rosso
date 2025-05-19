package com.husks.backend.mapper;

import org.mapstruct.*;
import com.husks.backend.entities.*;
import com.husks.backend.dtos.*;
import java.util.*;
import java.util.stream.*;

@Mapper(componentModel = "spring", uses = {CategoriaMapper.class, TalleMapper.class})
public interface ProductoMapper {

    @Mapping(target = "categoria", source = "categoriaId")
    @Mapping(target = "tallesDisponibles", source = "talleIds")
    Producto toEntity(ProductoRequestDTO dto);

    @Mapping(target = "categoriaId", source = "categoria.id")
    @Mapping(target = "talleIds", expression = "java(mapTalles(producto.getTallesDisponibles()))")
    ProductoRequestDTO toRequestDto(Producto producto);

    @Mapping(target = "categoria", source = "categoria.nombre")
    @Mapping(target = "talles", expression = "java(mapTallesToString(producto.getTallesDisponibles()))")
    @Mapping(target = "tipoProducto", source = "categoria.tipo.nombre")
    ProductoResponseDTO toResponseDto(Producto producto);

    // Métodos de apoyo
    default Set<Long> mapTalles(Set<Talle> talles) {
        return talles.stream().map(Talle::getId).collect(Collectors.toSet());
    }

    default Set<String> mapTallesToString(Set<Talle> talles) {
        return talles.stream()
                .map(t -> t.getSistema().name() + "-" + t.getValor())
                .collect(Collectors.toSet());
    }

    default Categoria idToCategoria(Long id) {
        if (id == null) return null;
        return Categoria.builder().id(id).build();
    }

    default Set<Talle> mapTalleIds(Set<Long> talleIds) {
        if (talleIds == null) return Collections.emptySet();
        return talleIds.stream()
                .map(id -> Talle.builder().id(id).build())
                .collect(Collectors.toSet());
    }
}