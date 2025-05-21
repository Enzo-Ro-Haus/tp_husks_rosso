package com.husks.backend.services;

import com.husks.backend.entities.Direccion;
import com.husks.backend.repositories.DireccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DireccionService {

    @Autowired
    private DireccionRepository direccionRepository;

    // Traer todas las direcciones
    public List<Direccion> listarDirecciones() {
        return direccionRepository.findAll();
    }

    // Crear una nueva direccion
    public Direccion crearDireccion(Direccion direccion) {
        return direccionRepository.save(direccion);
    }

    // Eliminar una direccion por ID
    public void borrarDireccion(Long id) {
        direccionRepository.deleteById(id);
    }

    // Buscar una direccion por ID
    public Direccion buscarDireccionPorId(Long id) {
        return direccionRepository.findById(id).orElse(null);
    }
}