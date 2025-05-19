package com.husks.backend.repositories;

import com.husks.backend.entities.Talle;

import com.husks.backend.enums.SistemaTalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TalleRepository extends JpaRepository<Talle, Long> {
    List<Talle> findBySistemaAndValorIn(SistemaTalle sistema, List<String> valores);
}
