package com.husks.backend.services;

import com.husks.backend.entities.Detalle;
import com.husks.backend.repositories.DetalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DetalleService {

    @Autowired
    private DetalleRepository detalleRepository;

    // Listar todos los detalles
    public List<Detalle> listarDetalles() {
        return detalleRepository.findAll();
    }

    // Buscar un detalle por ID
    public Optional<Detalle> buscarPorId(Long id) {
        return detalleRepository.findById(id);
    }

    // Crear un detalle
    public Detalle crearDetalle(Detalle detalle) {
        return detalleRepository.save(detalle);
    }

    // Actualizar un detalle existente
    public Optional<Detalle> actualizarDetalle(Long id, Detalle datos) {
        return detalleRepository.findById(id)
                .map(det -> {
                    det.setOrdenCompra(datos.getOrdenCompra());
                    det.setProducto(datos.getProducto());
                    det.setCantidad(datos.getCantidad());
                    return detalleRepository.save(det);
                });
    }

    // Eliminar un detalle por ID
    public boolean eliminarDetalle(Long id) {
        if (detalleRepository.existsById(id)) {
            detalleRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
