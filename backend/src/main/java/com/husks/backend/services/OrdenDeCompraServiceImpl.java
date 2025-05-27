package com.husks.backend.services;

import com.husks.backend.entities.OrdenDeCompra;
import com.husks.backend.repositories.BaseRepository;
import com.husks.backend.repositories.OrdenDeCompraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrdenDeCompraServiceImpl extends BaseServiceImpl<OrdenDeCompra, Long> implements OrdenDeCompraService{

    @Autowired
    private OrdenDeCompraRepository ordenDeCompraRepository;

    public OrdenDeCompraServiceImpl(BaseRepository<OrdenDeCompra, Long> baseRepository, OrdenDeCompraRepository ordenCompraRepository) {
        super(baseRepository);
        this.ordenDeCompraRepository = ordenCompraRepository;
    }
}