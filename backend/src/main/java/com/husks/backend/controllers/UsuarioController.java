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

    // --- GET /me: usuario autenticado ---
    @GetMapping("/me")
    public ResponseEntity<?> getMe(@org.springframework.security.core.annotation.AuthenticationPrincipal Usuario usuarioAuth) {
        if (usuarioAuth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }
        return ResponseEntity.ok(new UsuarioDTO(usuarioAuth));
    }

    // DTO para exponer solo los campos necesarios y evitar lazy loading
    public static class UsuarioDTO {
        public Long id;
        public String nombre;
        public String email;
        public String rol;
        public String imagenPerfilPublicId;
        public boolean activo;

        public UsuarioDTO(Usuario u) {
            this.id = u.getId();
            this.nombre = u.getNombre();
            this.email = u.getEmail();
            this.rol = u.getRol() != null ? u.getRol().name() : null;
            this.imagenPerfilPublicId = u.getImagenPerfilPublicId();
            this.activo = u.isActivo();
        }
    }

    // --- PATCH /me eliminado, ahora está en UsuarioMeController ---

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Usuario usuario) {
        try {
            Usuario usuarioExistente = servicio.findById(id);
            usuarioExistente.setNombre(usuario.getNombre());
            usuarioExistente.setEmail(usuario.getEmail());
            usuarioExistente.setImagenPerfilPublicId(usuario.getImagenPerfilPublicId());
            // ...otros campos que quieras permitir...
            servicio.save(usuarioExistente);
            return ResponseEntity.ok(usuarioExistente);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\":\"Error actualizando usuario\"}");
        }
    }

    @PatchMapping("/me/soft-delete")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<?> softDeleteMe(@org.springframework.security.core.annotation.AuthenticationPrincipal Usuario usuarioAuth) {
        try {
            System.out.println("[INFO] Soft delete solicitado para usuario: " + usuarioAuth.getEmail());
            usuarioAuth.setActivo(false);
            servicio.save(usuarioAuth);
            System.out.println("[INFO] Soft delete exitoso para usuario: " + usuarioAuth.getEmail());
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("{\"message\":\"Usuario dado de baja correctamente\"}");
        } catch (Exception e) {
            System.out.println("[ERROR] Error al hacer soft delete para usuario: " + usuarioAuth.getEmail() + ". Detalle: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\":\"Error en borrado lógico\"}");
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