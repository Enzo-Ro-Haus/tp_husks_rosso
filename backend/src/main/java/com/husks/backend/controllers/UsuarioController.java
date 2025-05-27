package com.husks.backend.controllers;

import com.husks.backend.entities.Usuario;
import com.husks.backend.services.UsuarioServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/husks/v1/usuario")
@CrossOrigin(origins = "*")
public class UsuarioController extends BaseControllerImpl<Usuario, UsuarioServiceImpl> {

    @Autowired
    public UsuarioController(UsuarioServiceImpl servicio) {
        super(servicio);
    }
}