package com.husks.backend.mapper;

import com.husks.backend.dtos.*;
import com.husks.backend.entities.Talle;
import com.husks.backend.enums.SistemaTalle;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface TalleMapper {

    Talle toEntity(TalleRequestDTO dto);

    @Mapping(target = "valor", source = "valor")
    @Mapping(target = "sistema", source = "sistema")
    TalleResponseDTO toDto(Talle talle);

    default String mapSistemaTalle(SistemaTalle sistema) {
        return sistema != null ? sistema.name() : null;
    }
}