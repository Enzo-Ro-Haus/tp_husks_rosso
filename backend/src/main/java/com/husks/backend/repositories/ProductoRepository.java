package com.husks.backend.repositories;

import com.husks.backend.entities.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.*;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    @Query("SELECT p FROM Producto p WHERE " +
            "(:categoriaId IS NULL OR p.categoria.id = :categoriaId) AND " +
            "(:precioMin IS NULL OR p.precio >= :precioMin) AND " +
            "(:precioMax IS NULL OR p.precio <= :precioMax)")
    Page<Producto> buscarConFiltros(
            @Param("categoriaId") Long categoriaId,
            @Param("precioMin") BigDecimal precioMin,
            @Param("precioMax") BigDecimal precioMax,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"categoria", "tallesDisponibles"})
    Optional<Producto> findWithDetailsById(Long id);
}
