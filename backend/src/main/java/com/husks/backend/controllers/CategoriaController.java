// CategoriaController.java
package com.husks.backend.controllers;

import com.husks.backend.entities.Categoria;
import com.husks.backend.services.CategoriaServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping(path ="/categoria")
@CrossOrigin(origins = "*")

public class CategoriaController extends BaseControllerImpl<Categoria, CategoriaServiceImpl> {

    @Autowired
    public CategoriaController(CategoriaServiceImpl servicio) {
        super(servicio);
    }

    @GetMapping("")
    public ResponseEntity<?> getAllCategorias() {
        return super.getAll();
    }

    @PutMapping("/{id}")
    @ResponseBody
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Categoria categoria) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(servicio.update(id, categoria));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"Error. UPDATE Intente mas tarde.\" }");
        }
    }

    @PatchMapping("/soft-delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> softDelete(@PathVariable Long id) {
        try {
            System.out.println("[INFO] Soft delete solicitado para categoría ID: " + id);
            Categoria categoria = servicio.findById(id);
            categoria.setActivo(false);
            servicio.save(categoria);
            System.out.println("[INFO] Soft delete exitoso para categoría ID: " + id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("{\"message\":\"Categoría dada de baja correctamente\"}");
        } catch (Exception e) {
            System.out.println("[ERROR] Error al hacer soft delete para categoría ID: " + id + ". Detalle: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\":\"Error en borrado lógico\"}");
        }
    }
}