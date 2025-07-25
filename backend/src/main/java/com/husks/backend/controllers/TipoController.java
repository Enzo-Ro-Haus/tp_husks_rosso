// TipoController.java
package com.husks.backend.controllers;

import com.husks.backend.entities.Tipo;
import com.husks.backend.services.TipoServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping(path = "/tipo")
@CrossOrigin(origins = "*")
public class TipoController extends BaseControllerImpl<Tipo, TipoServiceImpl>{

    @Autowired
    public TipoController(TipoServiceImpl servicio) {
        super(servicio);
    }

    @GetMapping("")
    public ResponseEntity<?> getAllTipos() {
        try {
            return ResponseEntity.ok(servicio.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\":\"Error obteniendo tipos\"}");
        }
    }

    @PutMapping("/{id}")
    @ResponseBody
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Tipo tipo) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(servicio.update(id, tipo));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"Error. UPDATE Intente mas tarde.\" }");
        }
    }

    @PatchMapping("/soft-delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> softDelete(@PathVariable Long id) {
        try {
            System.out.println("[INFO] Soft delete solicitado para tipo ID: " + id);
            Tipo tipo = servicio.findById(id);
            tipo.setActivo(false);
            servicio.save(tipo);
            System.out.println("[INFO] Soft delete exitoso para tipo ID: " + id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("{\"message\":\"Tipo dado de baja correctamente\"}");
        } catch (Exception e) {
            System.out.println("[ERROR] Error al hacer soft delete para tipo ID: " + id + ". Detalle: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\":\"Error en borrado lógico\"}");
        }
    }
}
