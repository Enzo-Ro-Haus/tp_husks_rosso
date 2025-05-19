package com.husks.backend.controllers;

import com.husks.backend.dtos.*;
import com.husks.backend.services.*;
import jakarta.validation.Valid;
import lombok.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/direcciones")
@RequiredArgsConstructor
public class DireccionController {

    private final DireccionService direccionService;

    @PostMapping
    public ResponseEntity<DireccionResponseDTO> crearDireccion(@Valid @RequestBody DireccionRequestDTO dto) {
        return new ResponseEntity<>(direccionService.crearDireccion(dto), HttpStatus.CREATED);
    }
}