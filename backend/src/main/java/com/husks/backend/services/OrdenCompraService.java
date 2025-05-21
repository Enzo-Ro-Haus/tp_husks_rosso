package com.husks.backend.services;

import com.husks.backend.entities.OrdenCompra;
import com.husks.backend.repositories.OrdenCompraRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrdenCompraService {

    @Autowired
    private OrdenCompraRepository ordenCompraRepository;

    // Listar todas las órdenes de compra
    public List<OrdenCompra> listarOrdenes() {
        return ordenCompraRepository.findAll();
    }

    // Buscar una orden por ID
    public Optional<OrdenCompra> buscarPorId(Long id) {
        return ordenCompraRepository.findById(id);
    }

    // Crear una nueva orden
    public OrdenCompra crearOrden(OrdenCompra orden) {
        // gracias a CascadeType.ALL, los detalles se persistirán automáticamente
        return ordenCompraRepository.save(orden);
    }

    public OrdenCompra actualizarOrden(Long id, OrdenCompra datos) {
        // obtenemos la orden o lanzamos excepción si no existe
        OrdenCompra ord = ordenCompraRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "OrdenCompra con id " + id + " no encontrada"));

        // actualizamos los campos
        ord.setUsuarioDireccion(datos.getUsuarioDireccion());
        ord.setFecha(datos.getFecha());
        ord.setPrecioTotal(datos.getPrecioTotal());
        ord.setMetodoPago(datos.getMetodoPago());
        ord.setEstado(datos.getEstado());

        // sincronizamos detalles (gracias a CascadeType.ALL)
        ord.getDetalles().clear();
        ord.getDetalles().addAll(datos.getDetalles());

        // guardamos y devolvemos la entidad actualizada
        return ordenCompraRepository.save(ord);
    }

    // Eliminar una orden por ID
    public boolean eliminarOrden(Long id) {
        if (ordenCompraRepository.existsById(id)) {
            ordenCompraRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
