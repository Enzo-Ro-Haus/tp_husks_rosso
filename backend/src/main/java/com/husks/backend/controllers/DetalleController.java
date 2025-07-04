// DetalleController.java
package com.husks.backend.controllers;

import com.husks.backend.entities.Detalle;
import com.husks.backend.services.DetalleServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping(path ="/detalle")
@CrossOrigin(origins = "*")
public class DetalleController extends  BaseControllerImpl<Detalle, DetalleServiceImpl> {

    @Autowired
    public DetalleController(DetalleServiceImpl servicio) {
        super(servicio);
    }

    @GetMapping("")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<?> getAllDetalles() {
        return super.getAll();
    }
}