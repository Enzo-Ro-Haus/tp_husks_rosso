package com.husks.backend.services;

import com.husks.backend.entities.Detalle;
import com.husks.backend.repositories.BaseRepository;
import com.husks.backend.repositories.DetalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DetalleServiceImpl extends BaseServiceImpl<Detalle, Long> implements DetalleService{

    @Autowired
    private DetalleRepository detalleRepository;

    public DetalleServiceImpl(BaseRepository<Detalle, Long> baseRepository, DetalleRepository detalleRepository) {
        super(baseRepository);
        this.detalleRepository = detalleRepository;
    }
}