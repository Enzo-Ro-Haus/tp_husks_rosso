package com.husks.backend.repositories;

import com.husks.backend.entities.Categoria;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

@Repository
public interface CategoriaRepository extends BaseRepository<Categoria, Long> {
    
    @Query("SELECT DISTINCT c FROM Categoria c LEFT JOIN FETCH c.tipos")
    List<Categoria> findAllWithTipos();
}
