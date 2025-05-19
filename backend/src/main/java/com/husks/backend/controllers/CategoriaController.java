package com.husks.backend.controllers;

import com.husks.backend.dtos.*;
import com.husks.backend.services.*;
import jakarta.validation.Valid;
import lombok.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;

    @PostMapping
    public ResponseEntity<CategoriaResponseDTO> crearCategoria(@Valid @RequestBody CategoriaRequestDTO dto) {
        return new ResponseEntity<>(categoriaService.crearCategoria(dto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}/productos")
    public ResponseEntity<List<ProductoResponseDTO>> obtenerProductosPorCategoria(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.obtenerProductosPorCategoria(id));
    }
}