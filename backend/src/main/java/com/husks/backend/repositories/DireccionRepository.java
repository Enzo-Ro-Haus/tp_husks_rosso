package com.husks.backend.repositories;

import com.husks.backend.entities.Direccion;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DireccionRepository extends BaseRepository<Direccion, Long> {

    Optional<Direccion> findByCalleAndLocalidadAndCp(String calle, String localidad, String cp);
}