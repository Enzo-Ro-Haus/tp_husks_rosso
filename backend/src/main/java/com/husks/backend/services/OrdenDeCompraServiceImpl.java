package com.husks.backend.services;

import com.husks.backend.entities.OrdenDeCompra;
import com.husks.backend.repositories.BaseRepository;
import com.husks.backend.repositories.OrdenDeCompraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrdenDeCompraServiceImpl
    extends BaseServiceImpl<OrdenDeCompra, Long>
    implements OrdenDeCompraService {

  private final OrdenDeCompraRepository ordenRepo;

  @Autowired
  public OrdenDeCompraServiceImpl(OrdenDeCompraRepository ordenRepo) {
    super(ordenRepo);
    this.ordenRepo = ordenRepo;
  }
}