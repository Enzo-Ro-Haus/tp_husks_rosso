// DetalleController.java
package com.husks.backend.controllers;

import com.husks.backend.entities.Detalle;
import com.husks.backend.services.DetalleServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path ="/husks/v1/detalle")
@CrossOrigin(origins = "*")
public class DetalleController extends  BaseControllerImpl<Detalle, DetalleServiceImpl> {

    @Autowired
    public DetalleController(DetalleServiceImpl servicio) {
        super(servicio);
    }
}