// ProductoService.java
package com.husks.backend.services;

import com.husks.backend.entities.Producto;
import java.util.List;

public interface ProductoService extends BaseService<Producto, Long> {
    List<Producto> findActiveProducts() throws Exception;
    Producto updateProductImage(Long id, String imagenPublicId) throws Exception;
}