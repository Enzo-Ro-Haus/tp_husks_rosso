// OrdenDeCompraController.java
package com.husks.backend.controllers;

import com.husks.backend.entities.OrdenDeCompra;
import com.husks.backend.services.OrdenDeCompraServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/orden-compra")
@CrossOrigin(origins = "*")
public class OrdenDeCompraController extends  BaseControllerImpl<OrdenDeCompra, OrdenDeCompraServiceImpl> {

    @Autowired
    public OrdenDeCompraController(OrdenDeCompraServiceImpl servicio) {
        super(servicio);
    }
}