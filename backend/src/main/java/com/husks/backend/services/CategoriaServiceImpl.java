package com.husks.backend.services;

import com.husks.backend.entities.Categoria;
import com.husks.backend.entities.Tipo;
import com.husks.backend.repositories.BaseRepository;
import com.husks.backend.repositories.CategoriaRepository;
import com.husks.backend.repositories.TipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CategoriaServiceImpl extends BaseServiceImpl<Categoria, Long> implements CategoriaService{

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private TipoRepository tipoRepository;

    public CategoriaServiceImpl(BaseRepository<Categoria, Long> baseRepository, CategoriaRepository categoriaRepository) {
        super(baseRepository);
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public Categoria save(Categoria categoria) throws Exception {
        // Si hay tipos, reemplazar por entidades gestionadas
        if (categoria.getTipos() != null && !categoria.getTipos().isEmpty()) {
            List<Tipo> tiposAdjuntos = new ArrayList<>();
            for (Tipo tipo : categoria.getTipos()) {
                if (tipo.getId() != null) {
                    Optional<Tipo> tipoOpt = tipoRepository.findById(tipo.getId());
                    tipoOpt.ifPresent(tiposAdjuntos::add);
                }
            }
            categoria.setTipos(tiposAdjuntos);
        }
        return super.save(categoria);
    }

    @Override
    public List<Categoria> findAll() throws Exception {
        return categoriaRepository.findAllWithTipos();
    }
}