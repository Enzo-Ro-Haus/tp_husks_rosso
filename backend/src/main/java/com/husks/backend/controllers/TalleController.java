// TalleController.java
package com.husks.backend.controllers;

import com.husks.backend.entities.Talle;
import com.husks.backend.services.TalleServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping(path = "/talle")
@CrossOrigin(origins = "*")
public class TalleController extends BaseControllerImpl<Talle, TalleServiceImpl>{

    @Autowired
    public TalleController(TalleServiceImpl servicio) {
        super(servicio);
    }

    @GetMapping("")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<?> getAllTalles() {
        return super.getAll();
    }
}