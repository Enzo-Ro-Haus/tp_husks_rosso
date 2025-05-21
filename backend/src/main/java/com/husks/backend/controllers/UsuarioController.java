package com.husks.backend.controllers;

import com.husks.backend.entities.Usuario;
import com.husks.backend.services.UsuarioService;
import org.springframework.beans.factory.annotation.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    UsuarioService usuarioService;

    @GetMapping
    @ResponseBody
    public List<Usuario> listaUsuario(){
        return usuarioService.listarUsuario();
    }

    @PostMapping
    @ResponseBody
    public Usuario crearUsuario(@RequestBody Usuario usuario){
        return usuarioService.crearUsuario(usuario);
    }

    @DeleteMapping("/{id}")
    public void borrarUsuario(@PathVariable Long id){
         usuarioService.borrarUsuario(id);
    }

    @GetMapping("/{id}")
    @ResponseBody
    public Usuario buscarUsuarioPorId(@PathVariable Long id){
        return usuarioService.buscarUsuarioPorId(id);
    }

}
