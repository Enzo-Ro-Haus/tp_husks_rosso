// OrdenDeCompraController.java
package com.husks.backend.controllers;

import com.husks.backend.entities.OrdenDeCompra;
import com.husks.backend.services.OrdenDeCompraServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping(path = "/orden-compra")
@CrossOrigin(origins = "*")
public class OrdenDeCompraController extends  BaseControllerImpl<OrdenDeCompra, OrdenDeCompraServiceImpl> {

    @Autowired
    public OrdenDeCompraController(OrdenDeCompraServiceImpl servicio) {
        super(servicio);
    }

    @PutMapping("/{id}")
    @ResponseBody
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody OrdenDeCompra orden) {
        try {
            System.out.println("Orden recibida: " + orden); // Debug
            System.out.println("ID: " + id); // Debug
            System.out.println("Usuario: " + orden.getUsuario()); // Debug
            System.out.println("Fecha: " + orden.getFecha()); // Debug
            System.out.println("Detalles: " + orden.getDetalles()); // Debug
            
            return ResponseEntity.status(HttpStatus.OK).body(servicio.update(id, orden));
        } catch (Exception e) {
            System.out.println("Error en update: " + e.getMessage()); // Debug
            e.printStackTrace(); // Debug
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"Error. UPDATE Intente mas tarde.\" }");
        }
    }

    @GetMapping("")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<?> getAllOrdenes() {
        return super.getAll();
    }

    @GetMapping("/mias")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<?> getMisOrdenes(@org.springframework.security.core.annotation.AuthenticationPrincipal com.husks.backend.entities.Usuario usuarioAuth) {
        try {
            Long usuarioId = usuarioAuth.getId();
            java.util.List<OrdenDeCompra> ordenes = servicio.findActiveByUsuarioId(usuarioId);
            return ResponseEntity.status(HttpStatus.OK).body(ordenes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\":\"Error obteniendo tus órdenes activas.\"}");
        }
    }

    @GetMapping("/preference/{preferenceId}")
    public ResponseEntity<?> getByPreferenceId(@PathVariable String preferenceId) {
        try {
            var orden = servicio.findByPreferenceId(preferenceId);
            if (orden == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Orden no encontrada");
            }
            return ResponseEntity.ok(orden);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error buscando la orden");
        }
    }

    @PostMapping("")
    @ResponseBody
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<?> save(@RequestBody OrdenDeCompra orden) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(servicio.save(orden));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"Error. SAVE Intente mas tarde.\" }");
        }
    }
}