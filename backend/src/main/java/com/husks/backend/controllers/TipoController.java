package com.husks.backend.controllers;

import com.husks.backend.entities.Tipo;
import com.husks.backend.services.TipoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tipo")
public class TipoController {

    @Autowired
    private TipoService tipoService;

    // GET /tipo
    @GetMapping
    public List<Tipo> listar() {
        return tipoService.listarTipos();
    }

    // GET /tipo/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Tipo> obtener(@PathVariable Long id) {
        return tipoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST /tipo
    @PostMapping
    public ResponseEntity<Tipo> crear(@RequestBody Tipo tipo) {
        Tipo creado = tipoService.guardarTipo(tipo);
        return ResponseEntity.ok(creado);
    }

    // PUT /tipo/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Tipo> actualizar(
            @PathVariable Long id,
            @RequestBody Tipo datos) {
        return tipoService.buscarPorId(id)
                .map(t -> {
                    t.setNombre(datos.getNombre());
                    // las categorías asociadas se gestionan por cascade desde Categoria
                    Tipo actualizado = tipoService.guardarTipo(t);
                    return ResponseEntity.ok(actualizado);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE /tipo/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> borrar(@PathVariable Long id) {
        if (tipoService.eliminarTipo(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
