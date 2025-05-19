package com.husks.backend.mapper;

import com.husks.backend.dtos.*;
import com.husks.backend.entities.*;
import org.mapstruct.*;

import java.util.*;
import java.util.stream.*;

@Mapper(componentModel = "spring")
public interface TipoMapper {

    // Request sin relaciones
    @Mapping(target = "categorias", ignore = true)
    Tipo toEntity(TipoRequestDTO dto);

    // Response con relaciones anidadas
    @Mapping(target = "categorias", expression = "java(mapCategorias(tipo.getCategorias()))")
    TipoResponseDTO toDto(Tipo tipo);

    default List<String> mapCategorias(List<Categoria> categorias) {
        return categorias.stream()
                .map(Categoria::getNombre)
                .collect(Collectors.toList());
    }

    // Actualización parcial
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateTipoFromDto(TipoRequestDTO dto, @MappingTarget Tipo entity);
}
