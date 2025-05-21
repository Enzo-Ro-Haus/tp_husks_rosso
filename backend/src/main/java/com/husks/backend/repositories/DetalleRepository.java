package com.husks.backend.repositories;

import com.husks.backend.entities.Detalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleRepository extends JpaRepository<Detalle, Long> {
    // Si quieres buscar todos los detalles de una orden:
    // List<Detalle> findByOrdenCompraId(Long ordenCompraId);
}
