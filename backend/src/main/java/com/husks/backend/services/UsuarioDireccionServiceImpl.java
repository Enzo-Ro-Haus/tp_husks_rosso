package com.husks.backend.services;

import com.husks.backend.entities.UsuarioDireccion;
import com.husks.backend.repositories.BaseRepository;
import com.husks.backend.repositories.UsuarioDireccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioDireccionServiceImpl extends BaseServiceImpl<UsuarioDireccion, Long> implements UsuarioDireccionService{

    @Autowired
    private UsuarioDireccionRepository usuarioDireccionRepository;

    public UsuarioDireccionServiceImpl(BaseRepository<UsuarioDireccion, Long> baseRepository, UsuarioDireccionRepository usuarioDireccionRepository) {
        super(baseRepository);
        this.usuarioDireccionRepository = usuarioDireccionRepository;
    }
}