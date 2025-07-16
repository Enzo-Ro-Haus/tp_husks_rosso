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
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
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
}