package com.husks.backend.repositories;

import com.husks.backend.entities.Producto;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends BaseRepository<Producto, Long> {
    
    @Query("SELECT p FROM Producto p LEFT JOIN FETCH p.tallesDisponibles LEFT JOIN FETCH p.categoria")
    List<Producto> findAllWithTalles();
    
    @Query("SELECT p FROM Producto p LEFT JOIN FETCH p.tallesDisponibles LEFT JOIN FETCH p.categoria WHERE p.activo = true")
    List<Producto> findActiveProductsWithTalles();

    @Query("SELECT p FROM Producto p LEFT JOIN FETCH p.tallesDisponibles LEFT JOIN FETCH p.categoria LEFT JOIN FETCH p.tipo")
    List<Producto> findAllWithRelations();

    @Query("""
        SELECT DISTINCT p FROM Producto p
        LEFT JOIN FETCH p.tallesDisponibles t
        LEFT JOIN FETCH p.categoria c
        LEFT JOIN FETCH p.tipo ti
        WHERE (:tipoId IS NULL OR ti.id = :tipoId)
        AND (:categoriaId IS NULL OR c.id = :categoriaId)
        AND (:nombre IS NULL OR LOWER(FUNCTION('unaccent', p.nombre)) LIKE LOWER(FUNCTION('unaccent', CONCAT('%', :nombre, '%'))))
        AND (:precioMin IS NULL OR p.precio >= :precioMin)
        AND (:precioMax IS NULL OR p.precio <= :precioMax)
        AND (:talleId IS NULL OR t.id = :talleId)
        AND (:sistemaTalle IS NULL OR t.sistema = :sistemaTalle)
        AND p.activo = true
    """)
    List<Producto> filtrarProductos(
        Long tipoId,
        Long categoriaId,
        String nombre,
        Double precioMin,
        Double precioMax,
        Long talleId,
        String sistemaTalle
    );
}
