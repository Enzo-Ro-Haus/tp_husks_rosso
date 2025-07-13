// UsuarioDireccionController.java
package com.husks.backend.controllers;

import com.husks.backend.entities.UsuarioDireccion;
import com.husks.backend.services.UsuarioDireccionServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/usuario-direccion")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
public class UsuarioDireccionController extends BaseControllerImpl<UsuarioDireccion, UsuarioDireccionServiceImpl>{

    @Autowired
    public UsuarioDireccionController(UsuarioDireccionServiceImpl servicio) {
        super(servicio);
    }

    @GetMapping("")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public org.springframework.http.ResponseEntity<?> getAllUsuarioDirecciones() {
        return super.getAll();
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<?> getActiveUsuarioDirecciones() {
        try {
            System.out.println("=== DEBUG: UsuarioDireccion active endpoint called ===");
            List<UsuarioDireccion> usuarioDirecciones = servicio.findActiveUsuarioDirecciones();
            System.out.println("=== DEBUG: Found " + usuarioDirecciones.size() + " active usuario direcciones ===");
            return ResponseEntity.status(HttpStatus.OK).body(usuarioDirecciones);
        } catch (Exception e) {
            System.out.println("=== DEBUG: Exception in getActiveUsuarioDirecciones: " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\":\"Error obteniendo direcciones activas.\"}");
        }
    }
}