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
    @Transactional
    public Tipo save(Tipo tipo) throws Exception {
        System.out.println("[DEBUG] save Tipo - categorias recibidas: " + (tipo.getCategorias() != null ? tipo.getCategorias().size() : "null"));
        // 1. Guardar el tipo sin relaciones para obtener el ID
        List<Categoria> categoriasAdjuntas = new ArrayList<>();
        if (tipo.getCategorias() != null && !tipo.getCategorias().isEmpty()) {
            for (Categoria cat : tipo.getCategorias()) {
                System.out.println("[DEBUG] Intentando asociar categoria con id: " + cat.getId());
                if (cat.getId() != null) {
                    Optional<Categoria> catOpt = categoriaRepository.findById(cat.getId());
                    if (catOpt.isPresent()) {
                        categoriasAdjuntas.add(catOpt.get());
                        System.out.println("[DEBUG] Categoria encontrada y asociada: " + cat.getId());
                    } else {
                        System.out.println("[DEBUG] Categoria NO encontrada: " + cat.getId());
                    }
                }
            }
        }
        tipo.setCategorias(new ArrayList<>()); // Limpia para el primer save
        Tipo guardado = tipoRepository.save(tipo);

        // 2. Asocia las relaciones y vuelve a guardar
        guardado.setCategorias(categoriasAdjuntas);
        Tipo finalGuardado = tipoRepository.save(guardado);
        // Forzar acceso a la colección para sincronizar
        if (finalGuardado.getCategorias() != null) {
            System.out.println("[DEBUG] Forzando acceso a categorias: " + finalGuardado.getCategorias().size());
        }
        System.out.println("[DEBUG] save Tipo - categorias asignadas: " + (finalGuardado.getCategorias() != null ? finalGuardado.getCategorias().size() : "null"));
        return finalGuardado;
    }

    @Override
    public Tipo update(Long id, Tipo tipo) throws Exception {
        Tipo existente = tipoRepository.findById(id)
            .orElseThrow(() -> new Exception("Tipo no encontrado"));

        existente.setNombre(tipo.getNombre());

        // Manejar la relación muchos a muchos
        if (tipo.getCategorias() != null) {
            List<Categoria> categoriasAdjuntas = new ArrayList<>();
            for (Categoria cat : tipo.getCategorias()) {
                if (cat.getId() != null) {
                    Categoria catEntity = categoriaRepository.findById(cat.getId())
                        .orElseThrow(() -> new Exception("Categoría no encontrada"));
                    categoriasAdjuntas.add(catEntity);
                }
            }
            existente.setCategorias(categoriasAdjuntas);
        } else {
            existente.setCategorias(new ArrayList<>());
        }

        return tipoRepository.save(existente);
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
