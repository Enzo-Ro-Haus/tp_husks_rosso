// DireccionController.java
package com.husks.backend.controllers;

import com.husks.backend.entities.Direccion;
import com.husks.backend.services.DireccionServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path ="/private/direccion")
@CrossOrigin(origins = "*")
public class DireccionController extends BaseControllerImpl<Direccion, DireccionServiceImpl> {

    @Autowired
    public DireccionController(DireccionServiceImpl servicio) {
        super(servicio);
    }
}