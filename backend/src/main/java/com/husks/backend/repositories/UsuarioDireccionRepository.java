package com.husks.backend.repositories;

import com.husks.backend.entities.UsuarioDireccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioDireccionRepository extends BaseRepository<UsuarioDireccion, Long> {
    // Si luego necesitas búsquedas por usuario o dirección, aquí podrías añadir métodos como:
    // List<UsuarioDireccion> findByUsuarioId(Long usuarioId);
}