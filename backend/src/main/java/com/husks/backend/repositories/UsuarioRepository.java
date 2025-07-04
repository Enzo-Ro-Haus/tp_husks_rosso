package com.husks.backend.repositories;

import com.husks.backend.entities.Usuario;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends BaseRepository<Usuario, Long> {
     Optional<Usuario> findByNombre(String nombre);
     Optional<Usuario> findByEmail(String email);
     
     @Query("SELECT DISTINCT u FROM Usuario u LEFT JOIN FETCH u.direcciones")
     List<Usuario> findAllWithRelations();
}