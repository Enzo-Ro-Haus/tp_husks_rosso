package com.husks.backend.controllers;

import com.husks.backend.entities.Direccion;
import com.husks.backend.services.DireccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/direccion")
public class DireccionController {

    @Autowired
    private DireccionService direccionService;

    @GetMapping
    @ResponseBody
    public List<Direccion> listaDirecciones() {
        return direccionService.listarDirecciones();
    }

    @PostMapping
    @ResponseBody
    public Direccion crearDireccion(@RequestBody Direccion direccion) {
        return direccionService.crearDireccion(direccion);
    }

    @GetMapping("/{id}")
    @ResponseBody
    public Direccion buscarDireccionPorId(@PathVariable Long id) {
        return direccionService.buscarDireccionPorId(id);
    }

    @DeleteMapping("/{id}")
    public void borrarDireccion(@PathVariable Long id) {
        direccionService.borrarDireccion(id);
    }
}