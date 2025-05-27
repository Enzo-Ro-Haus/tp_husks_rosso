package com.husks.backend.services;

import com.husks.backend.entities.Talle;

import com.husks.backend.repositories.BaseRepository;
import com.husks.backend.repositories.TalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class TalleServiceImpl extends BaseServiceImpl<Talle, Long> implements TalleService {

    @Autowired
    private TalleRepository talleRepository;

    public TalleServiceImpl(BaseRepository<Talle, Long> baseRepository, TalleRepository talleRepository) {
        super(baseRepository);
        this.talleRepository = talleRepository;
    }
}
