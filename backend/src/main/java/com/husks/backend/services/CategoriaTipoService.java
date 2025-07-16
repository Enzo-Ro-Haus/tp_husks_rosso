package com.husks.backend.services;

import com.husks.backend.entities.CategoriaTipo;

import java.util.List;

public interface CategoriaTipoService {
    CategoriaTipo createRelation(Long categoriaId, Long tipoId) throws Exception;
    void deleteRelation(Long categoriaId, Long tipoId) throws Exception;
    List<CategoriaTipo> findAll();
} 