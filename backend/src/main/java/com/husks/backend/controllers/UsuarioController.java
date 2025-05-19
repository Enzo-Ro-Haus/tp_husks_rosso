package com.husks.backend.controllers;

import com.husks.backend.dtos.*;
import com.husks.backend.services.*;
import jakarta.validation.Valid;
import lombok.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping("/registro")
    public ResponseEntity<UsuarioResponseDTO> registrarUsuario(@Valid @RequestBody UsuarioRequestDTO dto) {
        return new ResponseEntity<>(usuarioService.registrarUsuario(dto), HttpStatus.CREATED);
    }

   /* @GetMapping("/{id}/direcciones")
    public ResponseEntity<List<DireccionResponseDTO>> obtenerDireccionesUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerDireccionesUsuario(id));
    }*/
}