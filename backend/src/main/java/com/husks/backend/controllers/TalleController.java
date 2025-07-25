// TalleController.java
package com.husks.backend.controllers;

import com.husks.backend.entities.Talle;
import com.husks.backend.services.TalleServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping(path = "/talle")
@CrossOrigin(origins = "*")
public class TalleController extends BaseControllerImpl<Talle, TalleServiceImpl>{

    @Autowired
    public TalleController(TalleServiceImpl servicio) {
        super(servicio);
    }

    @GetMapping("")
    public ResponseEntity<?> getAllTalles() {
        return super.getAll();
    }

    @PatchMapping("/soft-delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> softDelete(@PathVariable Long id) {
        try {
            System.out.println("[INFO] Soft delete solicitado para talle ID: " + id);
            Talle talle = servicio.findById(id);
            talle.setActivo(false);
            servicio.save(talle);
            System.out.println("[INFO] Soft delete exitoso para talle ID: " + id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("{\"message\":\"Talle dado de baja correctamente\"}");
        } catch (Exception e) {
            System.out.println("[ERROR] Error al hacer soft delete para talle ID: " + id + ". Detalle: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\":\"Error en borrado lógico\"}");
        }
    }
}