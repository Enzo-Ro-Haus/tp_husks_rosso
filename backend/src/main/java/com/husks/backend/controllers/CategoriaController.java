// CategoriaController.java
package com.husks.backend.controllers;

import com.husks.backend.entities.Categoria;
import com.husks.backend.services.CategoriaServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path ="/husks/v1/categoria")
@CrossOrigin(origins = "*")
public class CategoriaController extends BaseControllerImpl<Categoria, CategoriaServiceImpl> {

    @Autowired
    public CategoriaController(CategoriaServiceImpl servicio) {
        super(servicio);
    }
}