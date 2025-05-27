// UsuarioDireccionController.java
package com.husks.backend.controllers;

import com.husks.backend.entities.UsuarioDireccion;
import com.husks.backend.services.UsuarioDireccionServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/husks/v1/usuario-direccion")
@CrossOrigin(origins = "*")
public class UsuarioDireccionController extends BaseControllerImpl<UsuarioDireccion, UsuarioDireccionServiceImpl>{

    @Autowired
    public UsuarioDireccionController(UsuarioDireccionServiceImpl servicio) {
        super(servicio);
    }
}