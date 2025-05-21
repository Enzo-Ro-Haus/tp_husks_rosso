package com.husks.backend.services;

import com.husks.backend.entities.*;
import com.husks.backend.repositories.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UsuarioService {

    @Autowired
    UsuarioRepository usuarioRepository;

    //Traer todos los usuarios
    public List<Usuario> listarUsuario(){
        return usuarioRepository.findAll();
    }

    //Crear un usuario
    public Usuario crearUsuario(Usuario usuario){
        return usuarioRepository.save(usuario);
    }

    //Eliminar un usuario
    public void borrarUsuario(Long id){
        usuarioRepository.deleteById(id);
    }

    //Buscar usuario por id
    public Usuario buscarUsuarioPorId(Long id){
        return usuarioRepository.findById(id).orElse(null);
    }

}
