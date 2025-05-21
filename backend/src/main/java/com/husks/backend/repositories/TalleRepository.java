package com.husks.backend.repositories;

import com.husks.backend.entities.Talle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TalleRepository extends JpaRepository<Talle, Long> {
    // Si necesitas buscar por sistema o valor:
    // List<Talle> findBySistema(SistemaTalle sistema);
    // Optional<Talle> findBySistemaAndValor(SistemaTalle sistema, String valor);
}
