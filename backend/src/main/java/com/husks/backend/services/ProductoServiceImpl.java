package com.husks.backend.services;

import com.husks.backend.entities.Producto;
import com.husks.backend.repositories.BaseRepository;
import com.husks.backend.repositories.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductoServiceImpl extends BaseServiceImpl<Producto, Long> implements ProductoService{

    @Autowired
    private ProductoRepository productoRepository;

    public ProductoServiceImpl(BaseRepository<Producto, Long> baseRepository, ProductoRepository productoRepository) {
        super(baseRepository);
        this.productoRepository = productoRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> findAll() {
        try {
            System.out.println("=== DEBUG: ProductoServiceImpl.findAll called ===");
            List<Producto> productos = productoRepository.findAllWithRelations();
            System.out.println("=== DEBUG: Found " + productos.size() + " productos in findAll ===");
            return productos;
        } catch (Exception e) {
            System.out.println("=== DEBUG: Exception in ProductoServiceImpl.findAll: " + e.getMessage() + " ===");
            e.printStackTrace();
            throw e;
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Producto> findActiveProducts() throws Exception {
        try {
            System.out.println("=== DEBUG: ProductoServiceImpl.findActiveProducts() called ===");
            List<Producto> productos = productoRepository.findActiveProductsWithTalles();
            System.out.println("=== DEBUG: Found " + productos.size() + " active products ===");
            return productos;
        } catch (Exception e) {
            System.out.println("=== DEBUG: Exception in ProductoServiceImpl.findActiveProducts(): " + e.getMessage() + " ===");
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
    }

    @Override
    @Transactional
    public Producto updateProductImage(Long id, String imagenPublicId) throws Exception {
        try {
            Producto producto = findById(id);
            producto.setImagenPublicId(imagenPublicId);
            return save(producto);
        } catch (Exception e) {
            throw new Exception("Error actualizando imagen del producto: " + e.getMessage());
        }
    }

    @Override
    public List<Producto> filtrarProductos(Long tipoId, Long categoriaId, String nombre, Double precioMin, Double precioMax, Long talleId, String sistemaTalle) throws Exception {
        return productoRepository.filtrarProductos(tipoId, categoriaId, nombre, precioMin, precioMax, talleId, sistemaTalle);
    }
}