package com.husks.backend.controllers;

import com.husks.backend.dtos.*;
import com.husks.backend.enums.EstadoOrden;
import com.husks.backend.services.*;
import jakarta.validation.Valid;
import lombok.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ordenes")
@RequiredArgsConstructor
public class OrdenCompraController {

    private final OrdenCompraService ordenService;

    @PostMapping
    public ResponseEntity<OrdenCompraResponseDTO> crearOrden(@Valid @RequestBody OrdenCompraRequestDTO dto) {
        return new ResponseEntity<>(ordenService.crearOrden(dto), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<OrdenCompraResponseDTO> actualizarEstado(
            @PathVariable Long id,
            @RequestParam EstadoOrden nuevoEstado
    ) {
        return ResponseEntity.ok(ordenService.actualizarEstadoOrden(id, nuevoEstado));
    }
}