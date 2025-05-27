// ProductoController.java
package com.husks.backend.controllers;

import com.husks.backend.entities.Producto;
import com.husks.backend.services.ProductoServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path ="/public/producto")
@CrossOrigin(origins = "*")
public class ProductoController extends BaseControllerImpl<Producto, ProductoServiceImpl>{

    @Autowired
    public ProductoController(ProductoServiceImpl servicio) {
        super(servicio);
    }
}