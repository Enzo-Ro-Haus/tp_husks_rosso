package com.husks.backend.services;

import com.husks.backend.entities.Tipo;
import com.husks.backend.repositories.TipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipoService {

    @Autowired
    private TipoRepository tipoRepository;

    // Listar todos los tipos
    public List<Tipo> listarTipos() {
        return tipoRepository.findAll();
    }

    // Buscar un tipo por ID
    public Optional<Tipo> buscarPorId(Long id) {
        return tipoRepository.findById(id);
    }

    // Crear o actualizar un tipo
    public Tipo guardarTipo(Tipo tipo) {
        return tipoRepository.save(tipo);
    }

    // Eliminar un tipo por ID
    public boolean eliminarTipo(Long id) {
        if (tipoRepository.existsById(id)) {
            tipoRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
