// ProductoController.java
package com.husks.backend.controllers;

import com.husks.backend.entities.Producto;
import com.husks.backend.services.ProductoServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping(path ="/producto")
@CrossOrigin(origins = "*")
public class ProductoController extends BaseControllerImpl<Producto, ProductoServiceImpl>{

    @Autowired
    public ProductoController(ProductoServiceImpl servicio) {
        super(servicio);
    }

    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        System.out.println("=== DEBUG: Producto ping endpoint called ===");
        return ResponseEntity.status(HttpStatus.OK).body("{\"message\":\"Producto controller is working\"}");
    }

    @GetMapping("/test-data")
    public ResponseEntity<?> testData() {
        System.out.println("=== DEBUG: Producto test-data endpoint called ===");
        try {
            List<Producto> productos = servicio.findAll();
            System.out.println("=== DEBUG: Found " + productos.size() + " productos ===");
            return ResponseEntity.status(HttpStatus.OK).body(productos);
        } catch (Exception e) {
            System.out.println("=== DEBUG: Exception in test-data: " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/public")
    @ResponseBody
    @CrossOrigin(origins = "*")
    public ResponseEntity<?> getPublicProducts() {
        System.out.println("=== DEBUG: Producto public endpoint called ===");
        try {
            List<Producto> productos = servicio.findActiveProducts();
            System.out.println("=== DEBUG: Found " + productos.size() + " public products ===");
            return ResponseEntity.status(HttpStatus.OK).body(productos);
        } catch (Exception e) {
            System.out.println("=== DEBUG: Exception in getPublicProducts: " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\":\"Error obteniendo productos públicos.\"}");
        }
    }

    @PatchMapping("/{id}/imagen")
    public ResponseEntity<?> updateProductImage(@PathVariable Long id, @RequestBody ImageUpdateRequest request) {
        try {
            Producto producto = servicio.updateProductImage(id, request.getImagenPublicId());
            return ResponseEntity.ok(producto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\":\"Error actualizando imagen del producto: " + e.getMessage() + "\"}");
        }
    }

    @GetMapping("")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<?> getAllProductos() {
        return super.getAll();
    }

    // Clase interna para el request
    public static class ImageUpdateRequest {
        private String imagenPublicId;

        public String getImagenPublicId() {
            return imagenPublicId;
        }

        public void setImagenPublicId(String imagenPublicId) {
            this.imagenPublicId = imagenPublicId;
        }
    }
}