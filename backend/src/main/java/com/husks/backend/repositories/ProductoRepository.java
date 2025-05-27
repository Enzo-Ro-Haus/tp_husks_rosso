package com.husks.backend.repositories;

import com.husks.backend.entities.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends BaseRepository<Producto, Long> {
    // Ejemplo de consulta por categoría:
    // List<Producto> findByCategoriaId(Long categoriaId);
}
