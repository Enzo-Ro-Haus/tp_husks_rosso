package com.husks.backend.services;

import com.husks.backend.entities.Categoria;
import com.husks.backend.repositories.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    // Listar todas las categorías
    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    // Buscar categoría por ID
    public Optional<Categoria> buscarPorId(Long id) {
        return categoriaRepository.findById(id);
    }

    // Crear o actualizar una categoría
    public Categoria guardarCategoria(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    // Eliminar categoría por ID
    public boolean eliminarCategoria(Long id) {
        if (categoriaRepository.existsById(id)) {
            categoriaRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
