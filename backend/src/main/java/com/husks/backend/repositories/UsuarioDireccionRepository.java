package com.husks.backend.repositories;

import com.husks.backend.entities.UsuarioDireccion;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioDireccionRepository extends BaseRepository<UsuarioDireccion, Long> {
    
    @Query("SELECT ud FROM UsuarioDireccion ud LEFT JOIN FETCH ud.usuario LEFT JOIN FETCH ud.direccion WHERE ud.activo = true")
    List<UsuarioDireccion> findAllActive();
    
    @Query("SELECT ud FROM UsuarioDireccion ud LEFT JOIN FETCH ud.usuario LEFT JOIN FETCH ud.direccion")
    List<UsuarioDireccion> findAllWithRelations();

    @Query("SELECT ud FROM UsuarioDireccion ud WHERE ud.id = :id AND ud.usuario.id = :usuarioId")
    UsuarioDireccion findByIdAndUsuarioId(Long id, Long usuarioId);

    @Query("SELECT ud FROM UsuarioDireccion ud LEFT JOIN FETCH ud.usuario LEFT JOIN FETCH ud.direccion WHERE ud.usuario.id = :usuarioId AND ud.activo = true")
    List<UsuarioDireccion> findActiveByUsuarioId(Long usuarioId);
}