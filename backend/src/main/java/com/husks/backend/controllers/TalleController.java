package com.husks.backend.controllers;

import com.husks.backend.entities.Talle;
import com.husks.backend.services.TalleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/talle")
public class TalleController {

    @Autowired
    private TalleService talleService;

    // GET /talle
    @GetMapping
    public List<Talle> listar() {
        return talleService.listarTalles();
    }

    // GET /talle/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Talle> obtener(@PathVariable Long id) {
        return talleService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST /talle
    @PostMapping
    public ResponseEntity<Talle> crear(@RequestBody Talle talle) {
        Talle creado = talleService.crearTalle(talle);
        return ResponseEntity.ok(creado);
    }

    // PUT /talle/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Talle> actualizar(
            @PathVariable Long id,
            @RequestBody Talle datos) {
        return talleService.actualizarTalle(id, datos)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE /talle/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> borrar(@PathVariable Long id) {
        if (talleService.eliminarTalle(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
