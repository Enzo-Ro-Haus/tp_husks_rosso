package com.husks.backend.services;

import com.husks.backend.entities.*;
import java.util.Optional;

public interface UsuarioService extends BaseService<Usuario, Long> {
    Usuario updateUserProfileImage(Long id, String imagenPerfilPublicId) throws Exception;
    Optional<Usuario> findByEmail(String email);
}
