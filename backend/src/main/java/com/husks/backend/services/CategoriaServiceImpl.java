package com.husks.backend.services;

import com.husks.backend.entities.Categoria;
import com.husks.backend.entities.Tipo;
import com.husks.backend.repositories.BaseRepository;
import com.husks.backend.repositories.CategoriaRepository;
import com.husks.backend.repositories.TipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    public Categoria save(Categoria categoria) throws Exception {
        System.out.println("[DEBUG] save Categoria - tipos recibidos: " + (categoria.getTipos() != null ? categoria.getTipos().size() : "null"));
        // 1. Guardar la categoría sin relaciones para obtener el ID
        List<Tipo> tiposAdjuntos = new ArrayList<>();
        if (categoria.getTipos() != null && !categoria.getTipos().isEmpty()) {
            for (Tipo tipo : categoria.getTipos()) {
                System.out.println("[DEBUG] Intentando asociar tipo con id: " + tipo.getId());
                if (tipo.getId() != null) {
                    Optional<Tipo> tipoOpt = tipoRepository.findById(tipo.getId());
                    if (tipoOpt.isPresent()) {
                        tiposAdjuntos.add(tipoOpt.get());
                        System.out.println("[DEBUG] Tipo encontrado y asociado: " + tipo.getId());
                    } else {
                        System.out.println("[DEBUG] Tipo NO encontrado: " + tipo.getId());
                    }
                }
            }
        }
        categoria.setTipos(new ArrayList<>()); // Limpia para el primer save
        Categoria guardada = categoriaRepository.save(categoria);

        // 2. Asocia las relaciones y vuelve a guardar
        guardada.setTipos(tiposAdjuntos);
        Categoria finalGuardada = categoriaRepository.save(guardada);
        // Forzar acceso a la colección para sincronizar
        if (finalGuardada.getTipos() != null) {
            System.out.println("[DEBUG] Forzando acceso a tipos: " + finalGuardada.getTipos().size());
        }
        System.out.println("[DEBUG] save Categoria - tipos asignados: " + (finalGuardada.getTipos() != null ? finalGuardada.getTipos().size() : "null"));
        return finalGuardada;
    }

    @Override
    public Categoria update(Long id, Categoria categoria) throws Exception {
        Categoria existente = categoriaRepository.findById(id)
            .orElseThrow(() -> new Exception("Categoría no encontrada"));

        existente.setNombre(categoria.getNombre());

        // Manejar la relación muchos a muchos
        if (categoria.getTipos() != null) {
            List<Tipo> tiposAdjuntos = new ArrayList<>();
            for (Tipo tipo : categoria.getTipos()) {
                if (tipo.getId() != null) {
                    Tipo tipoEntity = tipoRepository.findById(tipo.getId())
                        .orElseThrow(() -> new Exception("Tipo no encontrado"));
                    tiposAdjuntos.add(tipoEntity);
                }
            }
            existente.setTipos(tiposAdjuntos);
        } else {
            existente.setTipos(new ArrayList<>());
        }

        return categoriaRepository.save(existente);
    }

    @Override
    public List<Categoria> findAll() throws Exception {
        return categoriaRepository.findAllWithTipos();
    }
}