package com.husks.backend.services;

import com.husks.backend.entities.Talle;
import com.husks.backend.repositories.TalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TalleService {

    @Autowired
    private TalleRepository talleRepository;

    // Listar todos los talles
    public List<Talle> listarTalles() {
        return talleRepository.findAll();
    }

    // Buscar un talle por ID
    public Optional<Talle> buscarPorId(Long id) {
        return talleRepository.findById(id);
    }

    // Crear un nuevo talle
    public Talle crearTalle(Talle talle) {
        return talleRepository.save(talle);
    }

    // Actualizar un talle existente
    public Optional<Talle> actualizarTalle(Long id, Talle datos) {
        return talleRepository.findById(id)
                .map(t -> {
                    t.setSistema(datos.getSistema());
                    t.setValor(datos.getValor());
                    return talleRepository.save(t);
                });
    }

    // Eliminar un talle por ID
    public boolean eliminarTalle(Long id) {
        if (talleRepository.existsById(id)) {
            talleRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
