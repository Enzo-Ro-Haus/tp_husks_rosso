package com.husks.backend.mapper;

import com.husks.backend.dtos.*;
import com.husks.backend.entities.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {UsuarioMapper.class, DireccionMapper.class})
public interface UsuarioDireccionMapper {

    @Mapping(target = "usuario", source = "usuarioId")
    @Mapping(target = "direccion", source = "direccionId")
    UsuarioDireccion toEntity(UsuarioDireccionRequestDTO dto);

    @Mapping(target = "usuarioId", source = "usuario.id")
    @Mapping(target = "direccionId", source = "direccion.id")
    UsuarioDireccionRequestDTO toRequestDto(UsuarioDireccion entity);

    @Mapping(target = "usuario", source = "usuario")
    @Mapping(target = "direccion", source = "direccion")
    UsuarioDireccionResponseDTO toResponseDto(UsuarioDireccion entity);

    default Usuario mapUsuario(Long usuarioId) {
        return Usuario.builder().id(usuarioId).build();
    }

    default Direccion mapDireccion(Long direccionId) {
        return Direccion.builder().id(direccionId).build();
    }
}
