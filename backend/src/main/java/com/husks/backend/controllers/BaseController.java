package com.husks.backend.controllers;

import com.husks.backend.entities.Base;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.Serializable;

public interface BaseController<E extends Base, ID extends Serializable> {
    ResponseEntity<?> getAll();

    ResponseEntity<?> getAll(Pageable pageable);

    ResponseEntity<?> getOne(ID id);

    ResponseEntity<?> save(@RequestBody E entity);

    ResponseEntity<?> update(@PathVariable ID id, @RequestBody E entity);

    ResponseEntity<?> delete(@PathVariable ID id);

    default ResponseEntity<?> softDelete(@PathVariable ID id) {
        throw new UnsupportedOperationException("Soft delete no implementado para este recurso");
    }

    ResponseEntity<E> getCurrent(@AuthenticationPrincipal E usuarioAuth);
}
