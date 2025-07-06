// UsuarioDireccionController.java
package com.husks.backend.controllers;

import com.husks.backend.entities.UsuarioDireccion;
import com.husks.backend.services.UsuarioDireccionServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
}