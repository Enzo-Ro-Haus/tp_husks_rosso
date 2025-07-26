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

    @GetMapping("/auth-test")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<?> authTest() {
        System.out.println("=== DEBUG: Producto auth-test endpoint called ===");
        return ResponseEntity.status(HttpStatus.OK).body("{\"message\":\"Authentication successful\", \"timestamp\":\"" + System.currentTimeMillis() + "\"}");
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

    // --- NUEVO ENDPOINT DE FILTRADO ---
    @GetMapping("/filtrar")
    @ResponseBody
    @CrossOrigin(origins = "*")
    public ResponseEntity<?> filtrarProductos(
            @RequestParam(required = false) Long tipoId,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Double precioMin,
            @RequestParam(required = false) Double precioMax,
            @RequestParam(required = false) Long talleId,
            @RequestParam(required = false) String sistemaTalle
    ) {
        try {
            List<Producto> productos = servicio.filtrarProductos(tipoId, categoriaId, nombre, precioMin, precioMax, talleId, sistemaTalle);
            return ResponseEntity.status(HttpStatus.OK).body(productos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\":\"Error filtrando productos: " + e.getMessage() + "\"}");
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
        try {
            System.out.println("=== DEBUG: getAllProductos endpoint called ===");
            System.out.println("=== DEBUG: Authentication check passed ===");
            var result = servicio.findAll();
            System.out.println("=== DEBUG: Found " + result.size() + " productos ===");
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (Exception e) {
            System.out.println("=== DEBUG: Exception in getAllProductos: " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\":\"Error GETALL Intente mas tarde.\" }");
        }
    }

    @PatchMapping("/soft-delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> softDelete(@PathVariable Long id) {
        try {
            System.out.println("[INFO] Soft delete solicitado para producto ID: " + id);
            Producto producto = servicio.findById(id);
            producto.setActivo(false);
            servicio.save(producto);
            System.out.println("[INFO] Soft delete exitoso para producto ID: " + id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("{\"message\":\"Producto dado de baja correctamente\"}");
        } catch (Exception e) {
            System.out.println("[ERROR] Error al hacer soft delete para producto ID: " + id + ". Detalle: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\":\"Error en borrado lógico\"}");
        }
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