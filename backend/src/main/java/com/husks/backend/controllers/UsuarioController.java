package com.husks.backend.controllers;

import com.husks.backend.entities.Usuario;
import com.husks.backend.services.UsuarioServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/usuario")
@CrossOrigin(origins = "*")
public class UsuarioController extends BaseControllerImpl<Usuario, UsuarioServiceImpl> {

    @Autowired
    public UsuarioController(UsuarioServiceImpl servicio) {
        super(servicio);
    }

    @GetMapping("/me")
    public ResponseEntity<Usuario> getCurrentUser(
            @AuthenticationPrincipal Usuario usuarioAuth) {
        try {
            Usuario full = servicio.findById(usuarioAuth.getId());
            return ResponseEntity.ok(full);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

}