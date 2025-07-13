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
}