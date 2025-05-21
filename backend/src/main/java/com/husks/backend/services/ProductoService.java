package com.husks.backend.services;

import com.husks.backend.entities.Producto;
import com.husks.backend.repositories.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    // Listar todos los productos
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    // Crear o actualizar un producto
    public Producto guardarProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    // Buscar un producto por ID
    public Optional<Producto> buscarPorId(Long id) {
        return productoRepository.findById(id);
    }

    // Eliminar un producto
    public void eliminarProducto(Long id) {
        productoRepository.deleteById(id);
    }
}
