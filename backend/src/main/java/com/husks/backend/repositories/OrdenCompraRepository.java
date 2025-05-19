package com.husks.backend.repositories;

import com.husks.backend.entities.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrdenCompraRepository extends JpaRepository<OrdenCompra, Long> {
    @Query("SELECT oc FROM OrdenCompra oc WHERE oc.usuarioDireccion.usuario.id = :usuarioId")
    Page<OrdenCompra> findByUsuarioId(Long usuarioId, Pageable pageable);

    @Query("SELECT oc FROM OrdenCompra oc WHERE oc.fecha BETWEEN :start AND :end")
    List<OrdenCompra> findEntreFechas(LocalDate start, LocalDate end);
}