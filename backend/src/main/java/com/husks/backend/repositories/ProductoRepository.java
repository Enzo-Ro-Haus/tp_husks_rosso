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
}
