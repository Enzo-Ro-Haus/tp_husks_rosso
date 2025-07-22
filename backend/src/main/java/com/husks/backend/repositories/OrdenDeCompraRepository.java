package com.husks.backend.repositories;

import com.husks.backend.entities.OrdenDeCompra;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdenDeCompraRepository extends BaseRepository<OrdenDeCompra, Long> {
    
    @Query("SELECT DISTINCT o FROM OrdenDeCompra o LEFT JOIN FETCH o.usuario LEFT JOIN FETCH o.usuarioDireccion LEFT JOIN FETCH o.detalles d LEFT JOIN FETCH d.producto")
    List<OrdenDeCompra> findAllWithRelations();

    @Query("SELECT DISTINCT o FROM OrdenDeCompra o LEFT JOIN FETCH o.usuario LEFT JOIN FETCH o.usuarioDireccion LEFT JOIN FETCH o.detalles d LEFT JOIN FETCH d.producto WHERE o.usuario.id = :usuarioId AND o.activo = true")
    List<OrdenDeCompra> findActiveByUsuarioId(Long usuarioId);
}

