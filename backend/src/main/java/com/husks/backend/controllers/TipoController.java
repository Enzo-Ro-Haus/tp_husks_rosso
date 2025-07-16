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
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<?> getAllTipos() {
        return super.getAll();
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
    
}
