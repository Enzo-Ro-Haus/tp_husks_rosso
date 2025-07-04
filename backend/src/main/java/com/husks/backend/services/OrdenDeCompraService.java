// OrdenCompraService.java
package com.husks.backend.services;

import com.husks.backend.entities.OrdenDeCompra;

public interface OrdenDeCompraService extends BaseService<OrdenDeCompra, Long> {
    OrdenDeCompra update(Long id, OrdenDeCompra orden) throws Exception;
}
