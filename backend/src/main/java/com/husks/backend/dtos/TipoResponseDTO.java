package com.husks.backend.dtos;

import java.util.List;

public record TipoResponseDTO(
        Long id,
        String nombre,
        List<String> categorias
) {}