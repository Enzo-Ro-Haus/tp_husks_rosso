package com.husks.backend.mapper;

import com.husks.backend.dtos.*;
import com.husks.backend.entities.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CategoriaMapper {

    @Mapping(target = "tipo", source = "tipoId")
    Categoria toEntity(CategoriaRequestDTO dto);

    @Mapping(target = "tipo", source = "categoria.tipo.nombre")
    CategoriaResponseDTO toDto(Categoria categoria);

    default Tipo idToTipo(Long id) {
        return Tipo.builder().id(id).build();
    }
}