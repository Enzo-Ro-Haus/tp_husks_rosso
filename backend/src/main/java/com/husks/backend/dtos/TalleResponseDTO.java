package com.husks.backend.dtos;

import com.husks.backend.enums.SistemaTalle;

public record TalleResponseDTO(
        Long id,
        SistemaTalle sistema,
        String valor
) {}