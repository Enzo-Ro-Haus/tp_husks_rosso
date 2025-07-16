package com.husks.backend.services;

import com.husks.backend.entities.Categoria;
import com.husks.backend.entities.Tipo;
import com.husks.backend.entities.CategoriaTipo;
import com.husks.backend.repositories.CategoriaRepository;
import com.husks.backend.repositories.TipoRepository;
import com.husks.backend.repositories.CategoriaTipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaTipoServiceImpl implements CategoriaTipoService {
    @Autowired
    private CategoriaTipoRepository categoriaTipoRepository;
    @Autowired
    private CategoriaRepository categoriaRepository;
    @Autowired
    private TipoRepository tipoRepository;

    @Override
    public CategoriaTipo createRelation(Long categoriaId, Long tipoId) throws Exception {
        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new Exception("Categoría no encontrada"));
        Tipo tipo = tipoRepository.findById(tipoId)
                .orElseThrow(() -> new Exception("Tipo no encontrado"));
        CategoriaTipo relation = CategoriaTipo.builder()
                .categoria(categoria)
                .tipo(tipo)
                .build();
        return categoriaTipoRepository.save(relation);
    }

    @Override
    public void deleteRelation(Long categoriaId, Long tipoId) throws Exception {
        List<CategoriaTipo> relations = categoriaTipoRepository.findAll();
        for (CategoriaTipo rel : relations) {
            if (rel.getCategoria().getId().equals(categoriaId) && rel.getTipo().getId().equals(tipoId)) {
                categoriaTipoRepository.delete(rel);
                break;
            }
        }
    }

    @Override
    public List<CategoriaTipo> findAll() {
        return categoriaTipoRepository.findAll();
    }
} 