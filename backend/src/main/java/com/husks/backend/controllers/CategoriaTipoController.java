package com.husks.backend.controllers;

import com.husks.backend.entities.CategoriaTipo;
import com.husks.backend.services.CategoriaTipoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categoria-tipo")
@CrossOrigin(origins = "*")
public class CategoriaTipoController {
    @Autowired
    private CategoriaTipoService categoriaTipoService;

    @PostMapping("")
    public ResponseEntity<CategoriaTipo> createRelation(@RequestParam Long categoriaId, @RequestParam Long tipoId) throws Exception {
        CategoriaTipo relation = categoriaTipoService.createRelation(categoriaId, tipoId);
        return ResponseEntity.ok(relation);
    }

    @DeleteMapping("")
    public ResponseEntity<?> deleteRelation(@RequestParam Long categoriaId, @RequestParam Long tipoId) throws Exception {
        categoriaTipoService.deleteRelation(categoriaId, tipoId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("")
    public ResponseEntity<List<CategoriaTipo>> getAllRelations() {
        return ResponseEntity.ok(categoriaTipoService.findAll());
    }
} 