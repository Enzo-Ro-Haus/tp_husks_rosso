// ProductoService.java
package com.husks.backend.services;

import com.husks.backend.entities.Producto;
import com.husks.backend.enums.SistemaTalle;

import java.util.List;

public interface ProductoService extends BaseService<Producto, Long> {
    List<Producto> findActiveProducts() throws Exception;
    Producto updateProductImage(Long id, String imagenPublicId) throws Exception;
    List<Producto> filtrarProductos(Long tipoId, Long categoriaId, String nombre, Double precioMin, Double precioMax, Long talleId, SistemaTalle sistemaTalle) throws Exception;
}