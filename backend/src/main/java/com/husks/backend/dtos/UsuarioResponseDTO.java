package com.husks.backend.dtos;


import com.husks.backend.enums.Rol;

import java.util.Set;

public record UsuarioResponseDTO(
        Long id,
        String nombre,
        String email,
        Rol rol,
        Set<DireccionResponseDTO> direcciones
) {}