package com.husks.backend.controllers;

import com.husks.backend.entities.Base;
import com.husks.backend.services.BaseServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

public abstract class BaseControllerImpl<E extends Base, S extends BaseServiceImpl<E, Long>>
        implements BaseController<E, Long> {

    @Autowired
    protected S servicio;

    public BaseControllerImpl(S servicio) {
        this.servicio = servicio;
    }

    @GetMapping("/test")
    @ResponseBody
    @CrossOrigin(origins = "*")
    public ResponseEntity<?> test() {
        System.out.println("=== DEBUG: Test endpoint called ===");
        return ResponseEntity.status(HttpStatus.OK).body("{\"message\":\"Backend is working\"}");
    }

    @Override
    public ResponseEntity<?> getAll() {
        try {
            System.out.println("=== DEBUG: getAll() called ===");
            var result = servicio.findAll();
            System.out.println("=== DEBUG: Result size: " + (result != null ? result.size() : "null") + " ===");
            if (result != null && !result.isEmpty()) {
                System.out.println("=== DEBUG: First item: " + result.get(0) + " ===");
            }
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (Exception e) {
            System.out.println("=== DEBUG: Exception in getAll(): " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\":\"Error GETALL Intente mas tarde.\" }");
        }
    }

    @Override
    @GetMapping("/paged")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<?> getAll(Pageable pageable) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(servicio.finAll(pageable));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\":\"Error GETALL Intente mas tarde.\" }");
        }
    }

    @GetMapping("/{id}")
    @ResponseBody
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(servicio.findById(id));
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\":\"Error. GETONE Intente mas tarde.\" }");
        }
    }

    @PostMapping("")
    @ResponseBody
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> save(@RequestBody E entity) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(servicio.save(entity));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"Error. SAVE Intente mas tarde.\" }");
        }
    }

    @PutMapping("/{id}")
    @ResponseBody
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody E entity) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(servicio.update(id, entity));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"Error. UPDATE Intente mas tarde.\" }");
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(servicio.delete(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\":\"Error. DELETE Intente mas tarde.\" }");
        }
    }

    @PatchMapping("/soft-delete/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> softDelete(@PathVariable Long id) {
        try {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(servicio.softDelete(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\":\"Error en borrado lógico\"}");
        }
    }

    @PatchMapping("/restore/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> restore(@PathVariable Long id) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(servicio.restore(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\":\"Error al restaurar elemento\"}");
        }
    }

    @Override
    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<E> getCurrent(@AuthenticationPrincipal E usuarioAuth) {
        try {
            E full = servicio.findById(usuarioAuth.getId());
            return ResponseEntity.ok(full);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
    
}
