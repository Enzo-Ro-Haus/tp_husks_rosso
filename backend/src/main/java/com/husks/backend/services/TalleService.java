package com.husks.backend.services;

import com.husks.backend.dtos.*;
import com.husks.backend.enums.SistemaTalle;

import java.util.List;

public interface TalleService {
    TalleResponseDTO crearTalle(TalleRequestDTO dto);
    TalleResponseDTO actualizarTalle(Long id, TalleRequestDTO dto);
    List<TalleResponseDTO> listarTallesPorSistema(SistemaTalle sistema);
    void eliminarTalle(Long id);
    boolean existeTalle(Long id);
}