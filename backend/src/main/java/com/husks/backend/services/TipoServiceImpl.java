package com.husks.backend.services;

import com.husks.backend.entities.Tipo;
import com.husks.backend.repositories.BaseRepository;
import com.husks.backend.repositories.TipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TipoServiceImpl extends BaseServiceImpl<Tipo, Long> implements TipoService {

    @Autowired
    private TipoRepository tipoRepository;

    public TipoServiceImpl(BaseRepository<Tipo, Long> baseRepository, TipoRepository tipoRepository) {
        super(baseRepository);
        this.tipoRepository = tipoRepository;
    }
}
