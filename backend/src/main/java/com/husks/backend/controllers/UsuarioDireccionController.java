package com.husks.backend.controllers;

import com.husks.backend.entities.UsuarioDireccion;
import com.husks.backend.services.UsuarioDireccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuario-direccion")
public class UsuarioDireccionController {

    @Autowired
    private UsuarioDireccionService usuarioDireccionService;

    @GetMapping
    public List<UsuarioDireccion> listarTodas() {
        return usuarioDireccionService.listarTodas();
    }

    @PostMapping
    public UsuarioDireccion crear(@RequestBody UsuarioDireccion ud) {
        return usuarioDireccionService.crear(ud);
    }

    @GetMapping("/{id}")
    public UsuarioDireccion buscarPorId(@PathVariable Long id) {
        return usuarioDireccionService.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        usuarioDireccionService.eliminarPorId(id);
    }
}
