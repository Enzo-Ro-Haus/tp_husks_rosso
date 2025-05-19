package com.husks.backend.controllers;

import com.husks.backend.dtos.*;
import com.husks.backend.services.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/detalles")
@RequiredArgsConstructor
public class DetalleController {

    private final DetalleService detalleService;

    @PatchMapping("/{id}/cantidad")
    public ResponseEntity<DetalleResponseDTO> actualizarCantidad(
            @PathVariable Long id,
            @RequestParam @Min(1) Integer cantidad
    ) {
        return ResponseEntity.ok(detalleService.actualizarCantidad(id, cantidad));
    }
}
