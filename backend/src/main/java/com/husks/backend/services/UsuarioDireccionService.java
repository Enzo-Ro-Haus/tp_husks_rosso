package com.husks.backend.services;

import com.husks.backend.entities.UsuarioDireccion;
import com.husks.backend.repositories.UsuarioDireccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioDireccionService {

    @Autowired
    private UsuarioDireccionRepository usuarioDireccionRepository;

    // Listar todas las asociaciones
    public List<UsuarioDireccion> listarTodas() {
        return usuarioDireccionRepository.findAll();
    }

    // Crear una nueva asociación usuario–dirección
    public UsuarioDireccion crear(UsuarioDireccion ud) {
        return usuarioDireccionRepository.save(ud);
    }

    // Buscar por ID
    public UsuarioDireccion buscarPorId(Long id) {
        return usuarioDireccionRepository.findById(id).orElse(null);
    }

    // Eliminar por ID
    public void eliminarPorId(Long id) {
        usuarioDireccionRepository.deleteById(id);
    }
}
