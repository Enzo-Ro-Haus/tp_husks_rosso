package com.husks.backend.repositories;

import com.husks.backend.entities.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DireccionRepository extends JpaRepository<Direccion, Long> {
    @Query("SELECT d FROM Direccion d JOIN d.usuarios ud WHERE ud.usuario.id = :usuarioId")
    List<Direccion> findByUsuarioId(Long usuarioId);
}