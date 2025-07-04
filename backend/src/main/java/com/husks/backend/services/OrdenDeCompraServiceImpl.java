package com.husks.backend.services;

import com.husks.backend.entities.OrdenDeCompra;
import com.husks.backend.entities.Detalle;
import com.husks.backend.repositories.BaseRepository;
import com.husks.backend.repositories.OrdenDeCompraRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OrdenDeCompraServiceImpl
    extends BaseServiceImpl<OrdenDeCompra, Long>
    implements OrdenDeCompraService {

  private final OrdenDeCompraRepository ordenRepo;

  @Autowired
  public OrdenDeCompraServiceImpl(BaseRepository<OrdenDeCompra, Long> baseRepository, OrdenDeCompraRepository ordenRepo) {
    super(baseRepository);
    this.ordenRepo = ordenRepo;
  }

  @Override
  @Transactional(readOnly = true)
  public List<OrdenDeCompra> findAll() throws Exception {
    try {
      System.out.println("=== DEBUG: OrdenDeCompraServiceImpl.findAll() called ===");
      List<OrdenDeCompra> ordenes = ordenRepo.findAllWithRelations();
      System.out.println("=== DEBUG: Found " + ordenes.size() + " ordenes ===");
      if (!ordenes.isEmpty()) {
        System.out.println("=== DEBUG: First orden: " + ordenes.get(0).getId() + " ===");
        System.out.println("=== DEBUG: First orden usuario: " + (ordenes.get(0).getUsuario() != null ? ordenes.get(0).getUsuario().getNombre() : "null") + " ===");
      }
      return ordenes;
    } catch (Exception e) {
      System.out.println("=== DEBUG: Exception in OrdenDeCompraServiceImpl.findAll(): " + e.getMessage() + " ===");
      e.printStackTrace();
      throw new Exception(e.getMessage());
    }
  }

  @Override
  public OrdenDeCompra save(OrdenDeCompra orden) throws Exception {
    if (orden.getDetalles() != null) {
        for (Detalle detalle : orden.getDetalles()) {
            detalle.setOrdenDeCompra(orden);
        }
    }
    return ordenRepo.save(orden);
  }

  @Override
  @Transactional
  public OrdenDeCompra update(Long id, OrdenDeCompra orden) throws Exception {
    Optional<OrdenDeCompra> ordenOptional = ordenRepo.findById(id);
    if (ordenOptional.isPresent()) {
      OrdenDeCompra existingOrden = ordenOptional.get();
      
      // Copiar propiedades básicas
      BeanUtils.copyProperties(orden, existingOrden, "id", "detalles");
      
      // Manejar detalles si se proporcionan
      if (orden.getDetalles() != null && !orden.getDetalles().isEmpty()) {
        // Limpiar detalles existentes
        existingOrden.getDetalles().clear();
        
        // Agregar nuevos detalles
        for (Detalle detalle : orden.getDetalles()) {
          detalle.setOrdenDeCompra(existingOrden);
          existingOrden.getDetalles().add(detalle);
        }
      }
      
      return ordenRepo.save(existingOrden);
    } else {
      throw new RuntimeException("Orden no encontrada");
    }
  }
}