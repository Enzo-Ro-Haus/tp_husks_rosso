package com.husks.backend.services;

import com.husks.backend.entities.Base;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.List;

@Service
public interface BaseService<E extends Base, ID extends Serializable>  {
     List<E> findAll() throws Exception;
     Page<E> finAll(Pageable pageable) throws Exception;
     E findById(ID id) throws Exception;
     E save(E entity) throws Exception;
     E update(ID id, E entity) throws Exception;
     boolean delete(ID id) throws Exception;
}
