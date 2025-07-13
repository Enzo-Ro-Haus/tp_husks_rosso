// UsuarioDireccionService.java
package com.husks.backend.services;

import com.husks.backend.entities.UsuarioDireccion;

import java.util.List;

public interface UsuarioDireccionService extends BaseService<UsuarioDireccion, Long> {
    List<UsuarioDireccion> findActiveUsuarioDirecciones() throws Exception;
}