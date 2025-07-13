package com.husks.backend.services;

import com.husks.backend.entities.UsuarioDireccion;
import com.husks.backend.repositories.BaseRepository;
import com.husks.backend.repositories.UsuarioDireccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioDireccionServiceImpl extends BaseServiceImpl<UsuarioDireccion, Long> implements UsuarioDireccionService{

    @Autowired
    private UsuarioDireccionRepository usuarioDireccionRepository;

    public UsuarioDireccionServiceImpl(BaseRepository<UsuarioDireccion, Long> baseRepository, UsuarioDireccionRepository usuarioDireccionRepository) {
        super(baseRepository);
        this.usuarioDireccionRepository = usuarioDireccionRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioDireccion> findAll() throws Exception {
        try {
            System.out.println("=== DEBUG: UsuarioDireccionServiceImpl.findAll() called ===");
            List<UsuarioDireccion> usuarioDirecciones = usuarioDireccionRepository.findAllWithRelations();
            System.out.println("=== DEBUG: Found " + usuarioDirecciones.size() + " usuario direcciones ===");
            return usuarioDirecciones;
        } catch (Exception e) {
            System.out.println("=== DEBUG: Exception in UsuarioDireccionServiceImpl.findAll(): " + e.getMessage() + " ===");
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<UsuarioDireccion> findActiveUsuarioDirecciones() throws Exception {
        try {
            System.out.println("=== DEBUG: UsuarioDireccionServiceImpl.findActiveUsuarioDirecciones() called ===");
            List<UsuarioDireccion> usuarioDirecciones = usuarioDireccionRepository.findAllActive();
            System.out.println("=== DEBUG: Found " + usuarioDirecciones.size() + " active usuario direcciones ===");
            return usuarioDirecciones;
        } catch (Exception e) {
            System.out.println("=== DEBUG: Exception in UsuarioDireccionServiceImpl.findActiveUsuarioDirecciones(): " + e.getMessage() + " ===");
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
    }
}