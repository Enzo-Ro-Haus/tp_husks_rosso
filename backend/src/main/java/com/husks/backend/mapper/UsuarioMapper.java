package com.husks.backend.mapper;

import com.husks.backend.dtos.*;
import com.husks.backend.entities.*;
import org.mapstruct.*;

import java.util.*;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = DireccionMapper.class)
public interface UsuarioMapper {

    @Mapping(target = "password", source = "contraseña")
    Usuario toEntity(UsuarioRequestDTO dto);

    @Mapping(target = "direcciones", source = "direcciones")
    UsuarioResponseDTO toDto(Usuario usuario);

    default Set<DireccionResponseDTO> mapDirecciones(List<UsuarioDireccion> direcciones) {
        return direcciones.stream()
                .map(UsuarioDireccion::getDireccion)
                .map(d -> DireccionResponseDTO.builder()
                        .id(d.getId())
                        .calle(d.getCalle())
                        .localidad(d.getLocalidad())
                        .cp(d.getCp())
                        .build())
                .collect(Collectors.toSet());
    }
}