package com.husks.backend.services;

import com.husks.backend.entities.*;

public interface UsuarioService extends BaseService<Usuario, Long> {
    Usuario updateUserProfileImage(Long id, String imagenPerfilPublicId) throws Exception;
}
