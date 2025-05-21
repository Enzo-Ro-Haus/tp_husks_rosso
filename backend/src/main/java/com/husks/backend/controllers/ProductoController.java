package com.husks.backend.controllers;

import com.husks.backend.entities.Producto;
import com.husks.backend.services.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/producto")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public List<Producto> listar() {
        return productoService.listarProductos();
    }

    @PostMapping
    public Producto crear(@RequestBody Producto producto) {
        return productoService.guardarProducto(producto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(
            @PathVariable Long id,
            @RequestBody Producto datosProducto) {
        return productoService.buscarPorId(id)
                .map(prod -> {
                    prod.setNombre(datosProducto.getNombre());
                    prod.setPrecio(datosProducto.getPrecio());
                    prod.setCantidad(datosProducto.getCantidad());
                    prod.setDescripcion(datosProducto.getDescripcion());
                    prod.setColor(datosProducto.getColor());
                    prod.setCategoria(datosProducto.getCategoria());
                    prod.setTallesDisponibles(datosProducto.getTallesDisponibles());
                    Producto actualizado = productoService.guardarProducto(prod);
                    return ResponseEntity.ok(actualizado);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtener(@PathVariable Long id) {
        return productoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> borrar(@PathVariable Long id) {
        if (productoService.buscarPorId(id).isPresent()) {
            productoService.eliminarProducto(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
