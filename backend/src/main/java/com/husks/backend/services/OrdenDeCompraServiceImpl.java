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
  @Transactional(readOnly = true)
  public List<OrdenDeCompra> findActiveByUsuarioId(Long usuarioId) throws Exception {
    try {
      System.out.println("=== DEBUG: OrdenDeCompraServiceImpl.findActiveByUsuarioId(" + usuarioId + ") called ===");
      List<OrdenDeCompra> ordenes = ordenRepo.findActiveByUsuarioId(usuarioId);
      System.out.println("=== DEBUG: Found " + ordenes.size() + " active ordenes for usuarioId=" + usuarioId + " ===");
      return ordenes;
    } catch (Exception e) {
      System.out.println("=== DEBUG: Exception in OrdenDeCompraServiceImpl.findActiveByUsuarioId(): " + e.getMessage() + " ===");
      e.printStackTrace();
      throw new Exception(e.getMessage());
    }
  }

  @Override
  public OrdenDeCompra save(OrdenDeCompra orden) throws Exception {
    System.out.println("[DEBUG] Servicio.save() - Orden recibida:");
    System.out.println(orden);
    if (orden.getDetalles() != null) {
        for (Detalle detalle : orden.getDetalles()) {
            detalle.setOrdenDeCompra(orden);
        }
    }
    try {
      OrdenDeCompra saved = ordenRepo.save(orden);
      System.out.println("[DEBUG] Servicio.save() - Orden guardada:");
      System.out.println(saved);
      return saved;
    } catch (Exception e) {
      System.out.println("[DEBUG] Servicio.save() - Error al guardar la orden:");
      e.printStackTrace();
      throw e;
    }
  }

  @Override
  @Transactional
  public OrdenDeCompra update(Long id, OrdenDeCompra orden) throws Exception {
    Optional<OrdenDeCompra> ordenOptional = ordenRepo.findById(id);
    if (ordenOptional.isPresent()) {
      OrdenDeCompra existingOrden = ordenOptional.get();
      BeanUtils.copyProperties(orden, existingOrden, "id", "detalles");

      // --- SOFT DELETE EN DETALLES ---
      List<Detalle> detallesActuales = existingOrden.getDetalles();
      List<Long> idsDetallesRecibidos = new java.util.ArrayList<>();
      if (orden.getDetalles() != null) {
        for (Detalle d : orden.getDetalles()) {
          if (d.getId() != null) idsDetallesRecibidos.add(d.getId());
        }
      }
      // Marcar como inactivos los detalles que ya no están en la orden recibida
      for (Detalle detalleExistente : detallesActuales) {
        if (detalleExistente.getId() != null && !idsDetallesRecibidos.contains(detalleExistente.getId())) {
          detalleExistente.setActivo(false);
        }
      }
      // Limpiar detalles existentes solo lógicamente (no físicamente)
      detallesActuales.removeIf(d -> !d.isActivo());

      // Agregar o actualizar detalles recibidos
      if (orden.getDetalles() != null && !orden.getDetalles().isEmpty()) {
        for (Detalle detalle : orden.getDetalles()) {
          detalle.setOrdenDeCompra(existingOrden);
          detalle.setActivo(true);
          // Si es un detalle existente, actualizar cantidad
          if (detalle.getId() != null) {
            Detalle existente = detallesActuales.stream().filter(d -> d.getId().equals(detalle.getId())).findFirst().orElse(null);
            if (existente != null) {
              existente.setCantidad(detalle.getCantidad());
              existente.setProducto(detalle.getProducto());
              existente.setActivo(true);
            } else {
              detallesActuales.add(detalle);
            }
          } else {
            detallesActuales.add(detalle);
          }
        }
      }
      existingOrden.setDetalles(detallesActuales);
      return ordenRepo.save(existingOrden);
    } else {
      throw new RuntimeException("Orden no encontrada");
    }
  }

  public OrdenDeCompra findByPreferenceId(String preferenceId) {
      return ordenRepo.findByPreferenceId(preferenceId);
  }
}