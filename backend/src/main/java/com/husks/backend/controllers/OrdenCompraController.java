package com.husks.backend.controllers;

import com.husks.backend.entities.OrdenCompra;
import com.husks.backend.services.OrdenCompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orden-compra")
public class OrdenCompraController {

    @Autowired
    private OrdenCompraService ordenCompraService;

    // GET /orden-compra
    @GetMapping
    public List<OrdenCompra> listarTodas() {
        return ordenCompraService.listarOrdenes();
    }

    // GET /orden-compra/{id}
    @GetMapping("/{id}")
    public OrdenCompra buscarPorId(@PathVariable Long id) {
        return ordenCompraService.buscarPorId(id).orElse(null);
    }

    // POST /orden-compra
    @PostMapping
    public ResponseEntity<OrdenCompra> crear(@RequestBody OrdenCompra orden) {
        OrdenCompra creada = ordenCompraService.crearOrden(orden);
        return ResponseEntity.ok(creada);
    }

    // PUT /orden-compra/{id}
    @PutMapping("/{id}")
    public OrdenCompra actualizarPorId(@PathVariable Long id, @RequestBody OrdenCompra datos) {
        return ordenCompraService.actualizarOrden(id, datos);
    }

    // DELETE /orden-compra/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> borrar(@PathVariable Long id) {
        if (ordenCompraService.eliminarOrden(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
