package com.husks.backend.repositories;

import com.husks.backend.entities.Usuario;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends BaseRepository<Usuario, Long> {
     Optional<Usuario> findByNombre(String nombre);
     Optional<Usuario> findByEmail(String email);
}