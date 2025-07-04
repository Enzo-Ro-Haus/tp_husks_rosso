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
public class TipoServiceImpl extends BaseServiceImpl<Tipo, Long> implements TipoService {

    @Autowired
    private TipoRepository tipoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public TipoServiceImpl(BaseRepository<Tipo, Long> baseRepository, TipoRepository tipoRepository, CategoriaRepository categoriaRepository) {
        super(baseRepository);
        this.tipoRepository = tipoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public Tipo save(Tipo tipo) throws Exception {
        // Si hay categorías, reemplazar por entidades gestionadas
        if (tipo.getCategorias() != null && !tipo.getCategorias().isEmpty()) {
            List<Categoria> categoriasAdjuntas = new ArrayList<>();
            for (Categoria cat : tipo.getCategorias()) {
                if (cat.getId() != null) {
                    Optional<Categoria> catOpt = categoriaRepository.findById(cat.getId());
                    catOpt.ifPresent(categoriasAdjuntas::add);
                }
            }
            tipo.setCategorias(categoriasAdjuntas);
        }
        return super.save(tipo);
    }

    @Override
    public List<Tipo> findAll() throws Exception {
        return tipoRepository.findAllWithCategorias();
    }

    @Override
    public Tipo findById(Long id) throws Exception {
        // Usar un método similar a findAllWithCategorias pero para un solo tipo
        return tipoRepository.findByIdWithCategorias(id).orElseThrow(() -> new Exception("Tipo no encontrado"));
    }
}
