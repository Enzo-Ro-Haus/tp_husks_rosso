package com.husks.backend.controllers;

import com.husks.backend.entities.Usuario;
import com.husks.backend.enums.Rol;
import com.husks.backend.services.UsuarioServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping(path = "/usuario")
@CrossOrigin(origins = "*")
public class UsuarioController extends BaseControllerImpl<Usuario, UsuarioServiceImpl> {

    @Autowired
    public UsuarioController(UsuarioServiceImpl servicio) {
        super(servicio);
    }

    @PatchMapping("/{id}/imagen-perfil")
    public ResponseEntity<?> updateUserProfileImage(@PathVariable Long id, @RequestBody ImageUpdateRequest request) {
        try {
            Usuario usuario = servicio.updateUserProfileImage(id, request.getImagenPerfilPublicId());
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\":\"Error actualizando imagen de perfil: " + e.getMessage() + "\"}");
        }
    }

    @GetMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsuarios() {
        return super.getAll();
    }

    @PatchMapping("/{id}/activar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> activarUsuario(@PathVariable Long id) {
        try {
            Usuario usuario = servicio.findById(id);
            usuario.setActivo(true);
            servicio.save(usuario);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\":\"Error activando usuario: " + e.getMessage() + "\"}");
        }
    }

    @PatchMapping("/{id}/desactivar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> desactivarUsuario(@PathVariable Long id) {
        try {
            Usuario usuario = servicio.findById(id);
            usuario.setActivo(false);
            servicio.save(usuario);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\":\"Error desactivando usuario: " + e.getMessage() + "\"}");
        }
    }

    @PatchMapping("/{id}/corregir-rol-admin")
    public ResponseEntity<?> corregirRolAdmin(@PathVariable Long id) {
        try {
            Usuario usuario = servicio.findById(id);
            usuario.setRol(Rol.ADMIN);
            servicio.save(usuario);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\":\"Error corrigiendo rol de admin: " + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/admin-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminStatus() {
        try {
            Optional<Usuario> adminUser = servicio.findByEmail("admin@email.com");
            if (adminUser.isPresent()) {
                Usuario admin = adminUser.get();
                return ResponseEntity.ok(Map.of(
                    "exists", true,
                    "id", admin.getId(),
                    "nombre", admin.getNombre(),
                    "email", admin.getEmail(),
                    "rol", admin.getRol(),
                    "activo", admin.isActivo(),
                    "imagenPerfilPublicId", admin.getImagenPerfilPublicId()
                ));
            } else {
                return ResponseEntity.ok(Map.of("exists", false));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\":\"Error verificando estado del admin: " + e.getMessage() + "\"}");
        }
    }

    // Clase interna para el request
    public static class ImageUpdateRequest {
        private String imagenPerfilPublicId;

        public String getImagenPerfilPublicId() {
            return imagenPerfilPublicId;
        }

        public void setImagenPerfilPublicId(String imagenPerfilPublicId) {
            this.imagenPerfilPublicId = imagenPerfilPublicId;
        }
    }
}