package com.husks.backend.controllers;

import com.husks.backend.entities.Usuario;
import com.husks.backend.services.UsuarioServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/usuario/me")
@CrossOrigin(origins = "*")
public class UsuarioMeController {

    @Autowired
    private UsuarioServiceImpl servicio;

    @PatchMapping("")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<?> updateMe(@AuthenticationPrincipal Usuario usuarioAuth, @RequestBody Map<String, Object> updates) {
        try {
            System.out.println("[BACK] PATCH /usuario/me - usuarioAuth: " + (usuarioAuth != null ? ("id=" + usuarioAuth.getId() + ", email=" + usuarioAuth.getEmail() + ", rol=" + usuarioAuth.getRol()) : "null"));
            System.out.println("[BACK] PATCH /usuario/me - updates: " + updates);
            if (usuarioAuth == null) {
                System.out.println("[BACK] PATCH /usuario/me - usuarioAuth es null");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\":\"No autenticado\"}");
            }
            Usuario entity = new Usuario();
            entity.setId(usuarioAuth.getId());
            if (updates.containsKey("nombre")) entity.setNombre((String) updates.get("nombre"));
            if (updates.containsKey("email")) entity.setEmail((String) updates.get("email"));
            if (updates.containsKey("imagenPerfilPublicId")) entity.setImagenPerfilPublicId((String) updates.get("imagenPerfilPublicId"));
            if (updates.containsKey("password")) entity.setPassword((String) updates.get("password"));
            System.out.println("[BACK] PATCH /usuario/me - entity construido: " + entity);
            Usuario actualizado = servicio.update(usuarioAuth.getId(), entity);
            System.out.println("[BACK] PATCH /usuario/me - usuario actualizado: " + actualizado);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            System.out.println("[BACK] PATCH /usuario/me - ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\":\"Error actualizando perfil: " + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/debug")
    public ResponseEntity<?> debugMe() {
        System.out.println("[BACK] GET /usuario/me/debug alcanzado");
        return ResponseEntity.ok("OK - UsuarioMeController activo");
    }
} 