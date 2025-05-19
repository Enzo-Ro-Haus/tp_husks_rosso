package com.husks.backend.controllers;


import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.husks.backend.dtos.ProductoRequestDTO;
import com.husks.backend.dtos.ProductoResponseDTO;
import com.husks.backend.services.ProductoServiceImp;
import java.util.List;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoServiceImp service;

    public ProductoController(ProductoServiceImp service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ProductoResponseDTO> crear(@RequestBody ProductoRequestDTO dto) {
        ProductoResponseDTO creado = service.crear(dto);
        return new ResponseEntity<>(creado, HttpStatus.CREATED);
    }

    @GetMapping
    public List<ProductoResponseDTO> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponseDTO> obtener(@PathVariable Long id) {
        ProductoResponseDTO dto = service.obtenerPorId(id);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}