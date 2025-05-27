package com.husks.backend.repositories;

import com.husks.backend.entities.Tipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoRepository extends BaseRepository<Tipo, Long>{

}
