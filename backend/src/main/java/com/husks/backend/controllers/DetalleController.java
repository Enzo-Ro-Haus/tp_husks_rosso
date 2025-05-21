package com.husks.backend.controllers;

import com.husks.backend.entities.Detalle;
import com.husks.backend.services.DetalleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/detalle")
public class DetalleController {

    @Autowired
    private DetalleService detalleService;

    // GET /detalle
    @GetMapping
    public List<Detalle> listar() {
        return detalleService.listarDetalles();
    }

    // GET /detalle/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Detalle> obtener(@PathVariable Long id) {
        return detalleService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST /detalle
    @PostMapping
    public ResponseEntity<Detalle> crear(@RequestBody Detalle detalle) {
        Detalle creado = detalleService.crearDetalle(detalle);
        return ResponseEntity.ok(creado);
    }

    // PUT /detalle/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Detalle> actualizar(
            @PathVariable Long id,
            @RequestBody Detalle datos) {
        return detalleService.actualizarDetalle(id, datos)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE /detalle/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> borrar(@PathVariable Long id) {
        if (detalleService.eliminarDetalle(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
