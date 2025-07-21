package com.husks.backend.services;

import com.husks.backend.entities.Usuario;
import com.husks.backend.enums.Rol;
import com.husks.backend.repositories.BaseRepository;
import com.husks.backend.repositories.UsuarioRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImpl extends BaseServiceImpl<Usuario, Long> implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UsuarioServiceImpl(BaseRepository<Usuario, Long> baseRepository, UsuarioRepository usuarioRepository) {
        super(baseRepository);
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> findAll() throws Exception {
        try {
            List<Usuario> usuarios = usuarioRepository.findAllWithRelations();
            return usuarios;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    @Transactional
    public Usuario update(Long id, Usuario entity) throws Exception {
        try {
            Optional<Usuario> entityOptional = baseRepository.findById(id);
            if (entityOptional.isPresent()) {
                Usuario existingEntity = entityOptional.get();
                
                // Actualizar solo los campos específicos que queremos cambiar
                if (entity.getNombre() != null) {
                    existingEntity.setNombre(entity.getNombre());
                }
                if (entity.getEmail() != null) {
                    existingEntity.setEmail(entity.getEmail());
                }
                
                // Actualizar imagen de perfil si se proporciona
                if (entity.getImagenPerfilPublicId() != null) {
                    existingEntity.setImagenPerfilPublicId(entity.getImagenPerfilPublicId());
                }
                
                // NO permitir cambiar el rol de usuarios ADMIN
                if (entity.getRol() != null && !existingEntity.getRol().equals(Rol.ADMIN)) {
                    existingEntity.setRol(entity.getRol());
                } else if (entity.getRol() != null && existingEntity.getRol().equals(Rol.ADMIN)) {
                    System.out.println("ADVERTENCIA: Intento de cambiar rol de usuario ADMIN (ID: " + id + "). Rol no modificado.");
                }
                
                // Solo actualizar password si se proporciona uno nuevo
                if (entity.getPassword() != null && !entity.getPassword().trim().isEmpty()) {
                    existingEntity.setPassword(passwordEncoder.encode(entity.getPassword()));
                }
                
                System.out.println("Usuario a guardar: " + existingEntity);
                return baseRepository.save(existingEntity);
            } else {
                throw new jakarta.persistence.EntityNotFoundException("Usuario no encontrado");
            }
        } catch (Exception e) {
            System.err.println("Error en update de UsuarioServiceImpl: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    @Transactional
    public Usuario updateUserProfileImage(Long id, String imagenPerfilPublicId) throws Exception {
        try {
            Usuario usuario = findById(id);
            usuario.setImagenPerfilPublicId(imagenPerfilPublicId);
            return save(usuario);
        } catch (Exception e) {
            throw new Exception("Error actualizando imagen de perfil: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
}