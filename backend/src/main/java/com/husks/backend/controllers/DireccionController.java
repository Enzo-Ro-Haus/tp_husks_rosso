// DireccionController.java
package com.husks.backend.controllers;

import com.husks.backend.entities.Direccion;
import com.husks.backend.services.DireccionServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path ="/direccion")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
public class DireccionController extends BaseControllerImpl<Direccion, DireccionServiceImpl> {

    @Autowired
    public DireccionController(DireccionServiceImpl servicio) {
        super(servicio);
    }

    @GetMapping("")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public org.springframework.http.ResponseEntity<?> getAllDirecciones() {
        return super.getAll();
    }
}