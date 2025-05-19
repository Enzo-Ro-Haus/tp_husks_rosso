package com.husks.backend.dtos;

import lombok.Builder;

@Builder
public record DireccionResponseDTO(
        Long id,
        String calle,
        String localidad,
        String cp
) {}