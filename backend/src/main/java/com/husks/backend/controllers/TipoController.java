// TipoController.java
package com.husks.backend.controllers;

import com.husks.backend.entities.Tipo;
import com.husks.backend.services.TipoServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path ="/public/tipo")
@CrossOrigin(origins = "*")
public class TipoController extends BaseControllerImpl<Tipo, TipoServiceImpl>{

    @Autowired
    public TipoController(TipoServiceImpl servicio) {
        super(servicio);
    }
}
