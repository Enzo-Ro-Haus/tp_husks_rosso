// UsuarioDireccionController.java
package com.husks.backend.controllers;

import com.husks.backend.entities.UsuarioDireccion;
import com.husks.backend.services.UsuarioDireccionServiceImpl;
import com.husks.backend.repositories.UsuarioRepository;
import com.husks.backend.repositories.DireccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/usuario-direccion")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
public class UsuarioDireccionController extends BaseControllerImpl<UsuarioDireccion, UsuarioDireccionServiceImpl>{

    @Autowired
    public UsuarioDireccionController(UsuarioDireccionServiceImpl servicio) {
        super(servicio);
    }

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DireccionRepository direccionRepository;

    @GetMapping("")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public org.springframework.http.ResponseEntity<?> getAllUsuarioDirecciones() {
        return super.getAll();
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<?> getActiveUsuarioDirecciones() {
        try {
            System.out.println("=== DEBUG: UsuarioDireccion active endpoint called ===");
            List<UsuarioDireccion> usuarioDirecciones = servicio.findActiveUsuarioDirecciones();
            System.out.println("=== DEBUG: Found " + usuarioDirecciones.size() + " active usuario direcciones ===");
            return ResponseEntity.status(HttpStatus.OK).body(usuarioDirecciones);
        } catch (Exception e) {
            System.out.println("=== DEBUG: Exception in getActiveUsuarioDirecciones: " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\":\"Error obteniendo direcciones activas.\"}");
        }
    }

    @PostMapping("/relacion")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<?> save(@RequestBody Map<String, Object> body) {
        try {
            // Extraer usuario y datos de dirección del body
            Map<String, Object> usuarioMap = (Map<String, Object>) body.get("usuario");
            Map<String, Object> direccionMap = (Map<String, Object>) body.get("direccion");
            if (usuarioMap == null || direccionMap == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Faltan datos de usuario o dirección");
            }

            Long usuarioId = Long.valueOf(usuarioMap.get("id").toString());
            String calle = direccionMap.get("calle").toString();
            String localidad = direccionMap.get("localidad").toString();
            String cp = direccionMap.get("cp").toString();

            // Buscar usuario
            var usuarioOpt = usuarioRepository.findById(usuarioId);
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuario no encontrado");
            }
            var usuario = usuarioOpt.get();

            // Buscar o crear dirección
            var direccionOpt = direccionRepository.findByCalleAndLocalidadAndCp(calle, localidad, cp);
            var direccion = direccionOpt.orElseGet(() -> {
                var nueva = new com.husks.backend.entities.Direccion();
                nueva.setCalle(calle);
                nueva.setLocalidad(localidad);
                nueva.setCp(cp);
                nueva.setActivo(true);
                return direccionRepository.save(nueva);
            });

            // Crear relación usuario-dirección
            var usuarioDireccion = new com.husks.backend.entities.UsuarioDireccion();
            usuarioDireccion.setUsuario(usuario);
            usuarioDireccion.setDireccion(direccion);
            usuarioDireccion.setActivo(true);
            var saved = servicio.save(usuarioDireccion);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creando usuario-dirección: " + e.getMessage());
        }
    }
}