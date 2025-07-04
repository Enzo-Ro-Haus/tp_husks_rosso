// CategoriaController.java
package com.husks.backend.controllers;

import com.husks.backend.entities.Categoria;
import com.husks.backend.services.CategoriaServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

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
}