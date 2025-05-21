package com.husks.backend.controllers;

import com.husks.backend.entities.Categoria;
import com.husks.backend.services.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categoria")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    // GET /categoria
    @GetMapping
    public List<Categoria> listar() {
        return categoriaService.listarCategorias();
    }

    // GET /categoria/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> obtener(@PathVariable Long id) {
        return categoriaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST /categoria
    @PostMapping
    public ResponseEntity<Categoria> crear(@RequestBody Categoria categoria) {
        Categoria creada = categoriaService.guardarCategoria(categoria);
        return ResponseEntity.ok(creada);
    }

    // PUT /categoria/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> actualizar(
            @PathVariable Long id,
            @RequestBody Categoria datos) {
        return categoriaService.buscarPorId(id)
                .map(cat -> {
                    cat.setNombre(datos.getNombre());
                    cat.setTipo(datos.getTipo());
                    // productos se manejan en cascade desde Producto
                    Categoria actualizada = categoriaService.guardarCategoria(cat);
                    return ResponseEntity.ok(actualizada);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE /categoria/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> borrar(@PathVariable Long id) {
        if (categoriaService.eliminarCategoria(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
