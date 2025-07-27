package com.husks.backend.services;

import com.husks.backend.entities.OrdenDeCompra;
import com.husks.backend.entities.Producto;
import com.husks.backend.entities.Detalle;
import com.husks.backend.repositories.BaseRepository;
import com.husks.backend.repositories.OrdenDeCompraRepository;
import com.husks.backend.repositories.ProductoRepository;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import com.husks.backend.enums.EstadoOrden;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.resources.payment.Payment;

import jakarta.persistence.EntityNotFoundException;

import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class OrdenDeCompraServiceImpl
    extends BaseServiceImpl<OrdenDeCompra, Long>
    implements OrdenDeCompraService {

  private final OrdenDeCompraRepository ordenRepo;
  private final ProductoRepository productoRepo;

  @Autowired
  public OrdenDeCompraServiceImpl(
      BaseRepository<OrdenDeCompra, Long> baseRepository,
      OrdenDeCompraRepository ordenRepo,
      ProductoRepository productoRepo) {
    super(baseRepository);
    this.ordenRepo = ordenRepo;
    this.productoRepo = productoRepo;
  }

  @Override
  @Transactional(readOnly = true)
  public List<OrdenDeCompra> findAll() throws Exception {
    return ordenRepo.findAllWithRelations();
  }

  @Override
  @Transactional(readOnly = true)
  public List<OrdenDeCompra> findActiveByUsuarioId(Long usuarioId) throws Exception {
    return ordenRepo.findActiveByUsuarioId(usuarioId);
  }

  /**
   * Guarda la orden, sus detalles y descuenta stock de los productos.
   * Solo descuenta stock en creación, no en actualizaciones.
   */
  @Override
  @Transactional
  public OrdenDeCompra save(OrdenDeCompra orden) throws Exception {
     // Determinar si es una orden nueva (ID null antes de guardar)
    boolean isNewOrder = (orden.getId() == null);

    // Evitar duplicados: si es nueva y ya existe con el mismo preferenceId, retornar existente
    if (isNewOrder && orden.getPreferenceId() != null) {
      OrdenDeCompra dup = ordenRepo.findByPreferenceId(orden.getPreferenceId());
      if (dup != null) {
        return dup;
      }
    }

    // Vincular detalles con la orden
    if (orden.getDetalles() != null) {
      for (Detalle detalle : orden.getDetalles()) {
        detalle.setOrdenDeCompra(orden);
      }
    }

    // Guardar orden
    OrdenDeCompra saved = ordenRepo.save(orden);

    // Descontar stock por cada detalle solo si es nueva
    if (isNewOrder) {
      for (Detalle det : saved.getDetalles()) {
        Long prodId = det.getProducto().getId();
        Producto p = productoRepo.findById(prodId)
            .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con ID: " + prodId));

        int nuevoStock = p.getCantidad() - det.getCantidad();
        if (nuevoStock < 0) {
          throw new IllegalStateException(
              "Stock insuficiente para producto ID " + prodId + ". Disponible: " + p.getCantidad() +
              ", requerido: " + det.getCantidad());
        }
        p.setCantidad(nuevoStock);
        productoRepo.save(p);
      }
    }

    return saved;
  }

  @Override
  @Transactional
  public OrdenDeCompra update(Long id, OrdenDeCompra orden) throws Exception {
    Optional<OrdenDeCompra> opt = ordenRepo.findById(id);
    if (opt.isPresent()) {
      OrdenDeCompra existing = opt.get();
      BeanUtils.copyProperties(orden, existing, "id", "detalles");
      // Lógica de manejo de detalles (sin tocar stock aquí)
      return ordenRepo.save(existing);
    }
    throw new RuntimeException("Orden no encontrada");
  }
  public OrdenDeCompra findByPreferenceId(String preferenceId) {
      System.out.println("[DEBUG] OrdenDeCompraServiceImpl.findByPreferenceId() called with: " + preferenceId);
      OrdenDeCompra orden = ordenRepo.findByPreferenceId(preferenceId);
      if (orden != null) {
          System.out.println("[DEBUG] Orden encontrada: ID=" + orden.getId() + ", Estado=" + orden.getEstado() + ", PreferenceId=" + orden.getPreferenceId());
      } else {
          System.out.println("[DEBUG] No se encontró orden con preferenceId: " + preferenceId);
      }
      return orden;
  }

    /**
     * Consulta Mercado Pago por el estado del pago y actualiza la orden.
     * Devuelve el nuevo estado o null si no se actualizó.
     */
    public EstadoOrden actualizarEstadoDesdeMercadoPago(String preferenceId) {
        try {
            // Configura el access token (ideal: mover a config)
            String accessToken = "APP_USR-3234138127327288-072322-8e925fd50b06a15c71e38704a7290d59-2575816659";
            MercadoPagoConfig.setAccessToken(accessToken);

            // Busca la orden por preferenceId
            OrdenDeCompra orden = findByPreferenceId(preferenceId);
            if (orden == null) {
                System.out.println("[MANUAL MP] No se encontró orden con preferenceId: " + preferenceId);
                return null;
            }

            // Llama a la API de Mercado Pago para obtener la orden
            String url = "https://api.mercadopago.com/v1/orders/" + preferenceId;
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Content-Type", "application/json")
                    .GET()
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                System.out.println("[MANUAL MP] Error consultando orden en MP: " + response.body());
                return null;
            }
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.body());
            String mpStatus = root.path("status").asText();
            String mpStatusDetail = root.path("status_detail").asText();
            System.out.println("[MANUAL MP] Estado MP: " + mpStatus + ", Detalle: " + mpStatusDetail);

            // Mapear estado de Mercado Pago a EstadoOrden
            EstadoOrden nuevoEstado = mapearEstadoMercadoPago(mpStatus, mpStatusDetail);
            if (nuevoEstado != null && nuevoEstado != orden.getEstado()) {
                orden.setEstado(nuevoEstado);
                save(orden);
                System.out.println("[MANUAL MP] ✅ Orden actualizada: " + orden.getId() + " -> " + nuevoEstado);
                return nuevoEstado;
            } else {
                System.out.println("[MANUAL MP] No se actualizó la orden (mismo estado o estado nulo)");
                return null;
            }
        } catch (Exception e) {
            System.out.println("[MANUAL MP] Error consultando Mercado Pago: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    // Copia del mapeo de estados del webhook
    private EstadoOrden mapearEstadoMercadoPago(String mpStatus, String mpStatusDetail) {
        System.out.println("[MANUAL MP] Mapeando estado MP -> EstadoOrden");
        System.out.println("[MANUAL MP] - MP Status: " + mpStatus);
        System.out.println("[MANUAL MP] - MP Status Detail: " + mpStatusDetail);
        if (mpStatus == null) {
            System.out.println("[MANUAL MP] Status es null, retornando null");
            return null;
        }
        switch (mpStatus.toLowerCase()) {
            case "approved":
            case "accredited":
            case "processed":
                System.out.println("[MANUAL MP] Mapeo: approved/accredited/processed -> Entregado");
                return EstadoOrden.Entregado;
            case "pending":
            case "in_process":
                System.out.println("[MANUAL MP] Mapeo: pending/in_process -> En_proceso");
                return EstadoOrden.En_proceso;
            case "rejected":
            case "cancelled":
            case "refunded":
            case "charged_back":
                System.out.println("[MANUAL MP] Mapeo: rejected/cancelled/refunded/charged_back -> En_proceso");
                return EstadoOrden.En_proceso;
            case "authorized":
                System.out.println("[MANUAL MP] Mapeo: authorized -> En_proceso");
                return EstadoOrden.En_proceso;
            default:
                System.out.println("[MANUAL MP] Estado no reconocido: " + mpStatus + " -> En_proceso (default)");
                return EstadoOrden.En_proceso;
        }
    }
}