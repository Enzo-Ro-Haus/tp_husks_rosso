package com.husks.backend.repositories;

import com.husks.backend.entities.Detalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleRepository extends JpaRepository<Detalle, Long> {
    @Query("SELECT d FROM Detalle d WHERE d.ordenCompra.id = :ordenId")
    List<Detalle> findByOrdenId(Long ordenId);
}