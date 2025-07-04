package com.husks.backend.repositories;

import com.husks.backend.entities.Tipo;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

@Repository
public interface TipoRepository extends BaseRepository<Tipo, Long>{

    @Query("SELECT DISTINCT t FROM Tipo t LEFT JOIN FETCH t.categorias")
    List<Tipo> findAllWithCategorias();

    @Query("SELECT t FROM Tipo t LEFT JOIN FETCH t.categorias WHERE t.id = :id")
    Optional<Tipo> findByIdWithCategorias(Long id);

}
