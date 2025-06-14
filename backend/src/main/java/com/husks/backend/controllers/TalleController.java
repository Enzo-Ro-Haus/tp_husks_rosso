// TalleController.java
package com.husks.backend.controllers;

import com.husks.backend.entities.Talle;
import com.husks.backend.services.TalleServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/talle")
@CrossOrigin(origins = "*")
public class TalleController extends BaseControllerImpl<Talle, TalleServiceImpl>{

    @Autowired
    public TalleController(TalleServiceImpl servicio) {
        super(servicio);
    }
}