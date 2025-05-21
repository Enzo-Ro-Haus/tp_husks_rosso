package com.husks.backend.repositories;

import com.husks.backend.entities.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    // En caso de querer listar por tipo:
    // List<Categoria> findByTipoId(Long tipoId);
}
