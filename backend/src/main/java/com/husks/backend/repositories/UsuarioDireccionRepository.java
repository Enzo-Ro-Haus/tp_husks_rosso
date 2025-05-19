package com.husks.backend.repositories;

import com.husks.backend.entities.UsuarioDireccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioDireccionRepository extends JpaRepository<UsuarioDireccion, Long> {
    @Query("SELECT ud FROM UsuarioDireccion ud WHERE ud.usuario.id = :usuarioId")
    List<UsuarioDireccion> findDireccionesByUsuarioId(Long usuarioId);
}