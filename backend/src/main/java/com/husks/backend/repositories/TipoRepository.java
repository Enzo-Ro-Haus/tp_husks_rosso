package com.husks.backend.repositories;

import com.husks.backend.entities.Tipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoRepository extends JpaRepository<Tipo, Long> {
    // Si en el futuro necesitas buscar por nombre:
    // Optional<Tipo> findByNombre(String nombre);
}
