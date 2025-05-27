package com.husks.backend.services;

import com.husks.backend.entities.Direccion;
import com.husks.backend.repositories.BaseRepository;
import com.husks.backend.repositories.DireccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DireccionServiceImpl extends BaseServiceImpl<Direccion, Long> implements DireccionService{

    @Autowired
    private DireccionRepository direccionRepository;

    public DireccionServiceImpl(BaseRepository<Direccion, Long> baseRepository, DireccionRepository direccionRepository) {
        super(baseRepository);
        this.direccionRepository = direccionRepository;
    }
}