package com.husks.backend.mapper;

import com.husks.backend.dtos.*;
import com.husks.backend.entities.*;
import org.mapstruct.*;

import java.util.*;
import java.util.stream.*;

@Mapper(componentModel = "spring")
public interface DireccionMapper {

    // Mapeo de RequestDTO a Entidad
    @Mapping(target = "usuarios", ignore = true) // Relación que no participa en el DTO
    Direccion toEntity(DireccionRequestDTO dto);

    // Mapeo de Entidad a ResponseDTO
    @Mapping(target = "usuarios", expression = "java(mapUsuarios(direccion.getUsuarios()))")
    DireccionResponseDTO toDto(Direccion direccion);

    // Métodos de apoyo para relaciones
    default Set<UsuarioDireccionResponseDTO> mapUsuarios(List<UsuarioDireccion> usuariosDirecciones) {
        return usuariosDirecciones.stream()
                .map(ud -> new UsuarioDireccionResponseDTO(
                        ud.getUsuario().getId(),
                        ud.getUsuario().getNombre()
                ))
                .collect(Collectors.toSet());
    }

    // Mapeo para actualizaciones
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromDto(DireccionRequestDTO dto, @MappingTarget Direccion entity);
}

