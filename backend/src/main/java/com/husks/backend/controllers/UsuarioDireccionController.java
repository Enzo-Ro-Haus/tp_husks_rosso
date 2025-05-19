package com.husks.backend.controllers;


import com.husks.backend.services.*;
import lombok.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuario-direcciones")
@RequiredArgsConstructor
public class UsuarioDireccionController {

    private final UsuarioDireccionService usuarioDireccionService;

    @PostMapping
    public ResponseEntity<Void> asociarDireccion(
            @RequestParam Long usuarioId,
            @RequestParam Long direccionId
    ) {
        usuarioDireccionService.asociarDireccionUsuario(usuarioId, direccionId);
        return ResponseEntity.noContent().build();
    }
}