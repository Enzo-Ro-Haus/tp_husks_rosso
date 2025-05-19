package com.husks.backend.controllers;

import com.husks.backend.dtos.*;
import com.husks.backend.services.*;
import jakarta.validation.Valid;
import lombok.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos")
@RequiredArgsConstructor
public class TipoController {

    private final TipoService tipoService;

    @PostMapping
    public ResponseEntity<TipoResponseDTO> crearTipo(@Valid @RequestBody TipoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tipoService.crearTipo(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoResponseDTO> obtenerTipo(@PathVariable Long id) {
        return ResponseEntity.ok(tipoService.obtenerTipoPorId(id));
    }

    @GetMapping("/{id}/categorias")
    public ResponseEntity<List<CategoriaResponseDTO>> obtenerCategoriasPorTipo(@PathVariable Long id) {
        return ResponseEntity.ok(tipoService.obtenerCategoriasPorTipo(id));
    }
}