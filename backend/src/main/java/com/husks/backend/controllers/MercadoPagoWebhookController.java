package com.husks.backend.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.husks.backend.entities.OrdenDeCompra;
import com.husks.backend.enums.EstadoOrden;
import com.husks.backend.services.OrdenDeCompraServiceImpl;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.order.OrderClient;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.order.Order;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mercadopago/webhook")
public class MercadoPagoWebhookController {

    @Autowired
    private OrdenDeCompraServiceImpl ordenService;

    // Access Token de Mercado Pago - DEBERÍA ESTAR EN application.properties
    private static final String MP_ACCESS_TOKEN = "APP_USR-3234138127327288-072322-8e925fd50b06a15c71e38704a7290d59-2575816659";

    @PostMapping
    public ResponseEntity<String> recibirNotificacion(@RequestBody String payload) {
        System.out.println("=== [WEBHOOK MP] === Notificación recibida ===");
        System.out.println("[WEBHOOK MP] Payload completo: " + payload);
        
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(payload);
            
            String type = root.path("type").asText();
            String dataId = root.path("data").path("id").asText();
            
            System.out.println("[WEBHOOK MP] Tipo de notificación: " + type);
            System.out.println("[WEBHOOK MP] Data ID: " + dataId);
            
            // Configurar el access token
            MercadoPagoConfig.setAccessToken(MP_ACCESS_TOKEN);
            
            if ("payment".equals(type)) {
                return procesarNotificacionPago(dataId);
            } else if ("merchant_order".equals(type)) {
                return procesarNotificacionOrden(dataId);
            } else {
                System.out.println("[WEBHOOK MP] Tipo de notificación no manejado: " + type);
                return ResponseEntity.ok("Tipo no manejado");
            }
            
        } catch (Exception e) {
            System.out.println("[WEBHOOK MP] ERROR procesando webhook: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error procesando webhook: " + e.getMessage());
        }
    }
    
    private ResponseEntity<String> procesarNotificacionPago(String paymentId) {
        System.out.println("[WEBHOOK MP] Procesando notificación de pago: " + paymentId);
        
        try {
            PaymentClient paymentClient = new PaymentClient();
            Payment payment = paymentClient.get(Long.parseLong(paymentId));
            
            System.out.println("[WEBHOOK MP] Pago obtenido de MP:");
            System.out.println("[WEBHOOK MP] - ID: " + payment.getId());
            System.out.println("[WEBHOOK MP] - Status: " + payment.getStatus());
            System.out.println("[WEBHOOK MP] - Status Detail: " + payment.getStatusDetail());
            System.out.println("[WEBHOOK MP] - Order ID: " + (payment.getOrder() != null ? payment.getOrder().getId() : "null"));
            
            // Obtener preferenceId del pago
            String preferenceId = null;
            if (payment.getOrder() != null) {
                preferenceId = String.valueOf(payment.getOrder().getId());
                System.out.println("[WEBHOOK MP] PreferenceId desde Order: " + preferenceId);
            } else if (payment.getMetadata() != null && payment.getMetadata().get("preference_id") != null) {
                preferenceId = payment.getMetadata().get("preference_id").toString();
                System.out.println("[WEBHOOK MP] PreferenceId desde Metadata: " + preferenceId);
            }
            
            if (preferenceId != null && !preferenceId.isEmpty()) {
                return actualizarOrdenPorPreferenceId(preferenceId, payment.getStatus(), payment.getStatusDetail());
            } else {
                System.out.println("[WEBHOOK MP] No se pudo obtener preferenceId del pago");
                return ResponseEntity.ok("PreferenceId no encontrado");
            }
            
        } catch (MPApiException e) {
            System.out.println("[WEBHOOK MP] ERROR MPApiException: " + e.getMessage());
            System.out.println("[WEBHOOK MP] Error details: " + e.getApiResponse().getContent());
            return ResponseEntity.status(500).body("Error consultando pago en Mercado Pago: " + e.getMessage());
        } catch (MPException e) {
            System.out.println("[WEBHOOK MP] ERROR MPException: " + e.getMessage());
            return ResponseEntity.status(500).body("Error consultando pago en Mercado Pago: " + e.getMessage());
        }
    }
    
    private ResponseEntity<String> procesarNotificacionOrden(String orderId) {
        System.out.println("[WEBHOOK MP] Procesando notificación de orden: " + orderId);
        
        try {
            OrderClient orderClient = new OrderClient();
            Order order = orderClient.get(orderId);
            
            System.out.println("[WEBHOOK MP] Orden obtenida de MP:");
            System.out.println("[WEBHOOK MP] - ID: " + order.getId());
            System.out.println("[WEBHOOK MP] - Status: " + order.getStatus());
            System.out.println("[WEBHOOK MP] - Status Detail: " + order.getStatusDetail());
            System.out.println("[WEBHOOK MP] - Total Amount: " + order.getTotalAmount());
            System.out.println("[WEBHOOK MP] - Total Paid Amount: " + order.getTotalPaidAmount());
            
            // Buscar orden por preferenceId (que es el orderId de MP)
            return actualizarOrdenPorPreferenceId(orderId, order.getStatus(), order.getStatusDetail());
            
        } catch (MPApiException e) {
            System.out.println("[WEBHOOK MP] ERROR MPApiException consultando orden: " + e.getMessage());
            return ResponseEntity.status(500).body("Error consultando orden en Mercado Pago: " + e.getMessage());
        } catch (MPException e) {
            System.out.println("[WEBHOOK MP] ERROR MPException consultando orden: " + e.getMessage());
            return ResponseEntity.status(500).body("Error consultando orden en Mercado Pago: " + e.getMessage());
        }
    }
    
    private ResponseEntity<String> actualizarOrdenPorPreferenceId(String preferenceId, String mpStatus, String mpStatusDetail) {
        System.out.println("[WEBHOOK MP] Buscando orden con preferenceId: " + preferenceId);
        
        OrdenDeCompra orden = ordenService.findByPreferenceId(preferenceId);
        if (orden == null) {
            System.out.println("[WEBHOOK MP] No se encontró orden con preferenceId: " + preferenceId);
            return ResponseEntity.ok("Orden no encontrada");
        }
        
        System.out.println("[WEBHOOK MP] Orden encontrada:");
        System.out.println("[WEBHOOK MP] - ID: " + orden.getId());
        System.out.println("[WEBHOOK MP] - Estado actual: " + orden.getEstado());
        System.out.println("[WEBHOOK MP] - PreferenceId: " + orden.getPreferenceId());
        
        // Mapear estado de Mercado Pago a nuestro EstadoOrden
        EstadoOrden nuevoEstado = mapearEstadoMercadoPago(mpStatus, mpStatusDetail);
        
        System.out.println("[WEBHOOK MP] Mapeo de estados:");
        System.out.println("[WEBHOOK MP] - MP Status: " + mpStatus);
        System.out.println("[WEBHOOK MP] - MP Status Detail: " + mpStatusDetail);
        System.out.println("[WEBHOOK MP] - Nuevo estado: " + nuevoEstado);
        
        if (nuevoEstado != null && nuevoEstado != orden.getEstado()) {
            orden.setEstado(nuevoEstado);
            try {
                ordenService.save(orden);
                System.out.println("[WEBHOOK MP] ✅ Orden actualizada exitosamente:");
                System.out.println("[WEBHOOK MP] - ID: " + orden.getId());
                System.out.println("[WEBHOOK MP] - Estado anterior: " + orden.getEstado());
                System.out.println("[WEBHOOK MP] - Estado nuevo: " + nuevoEstado);
                return ResponseEntity.ok("Orden actualizada: " + orden.getId() + " -> " + nuevoEstado);
            } catch (Exception e) {
                System.out.println("[WEBHOOK MP] ERROR guardando orden: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.status(500).body("Error guardando orden: " + e.getMessage());
            }
        } else {
            System.out.println("[WEBHOOK MP] No se actualizó la orden (mismo estado o estado nulo)");
            return ResponseEntity.ok("Orden no actualizada (mismo estado)");
        }
    }
    
    private EstadoOrden mapearEstadoMercadoPago(String mpStatus, String mpStatusDetail) {
        System.out.println("[WEBHOOK MP] Mapeando estado MP -> EstadoOrden");
        System.out.println("[WEBHOOK MP] - MP Status: " + mpStatus);
        System.out.println("[WEBHOOK MP] - MP Status Detail: " + mpStatusDetail);
        
        if (mpStatus == null) {
            System.out.println("[WEBHOOK MP] Status es null, retornando null");
            return null;
        }
        
        // Mapeo más específico basado en status y status_detail
        switch (mpStatus.toLowerCase()) {
            case "approved":
                System.out.println("[WEBHOOK MP] Mapeo: approved -> Entregado");
                return EstadoOrden.Entregado;
                
            case "accredited":
                System.out.println("[WEBHOOK MP] Mapeo: accredited -> Entregado");
                return EstadoOrden.Entregado;
                
            case "pending":
                if ("pending_waiting_payment".equals(mpStatusDetail)) {
                    System.out.println("[WEBHOOK MP] Mapeo: pending (waiting_payment) -> En_proceso");
                    return EstadoOrden.En_proceso;
                } else {
                    System.out.println("[WEBHOOK MP] Mapeo: pending -> En_proceso");
                    return EstadoOrden.En_proceso;
                }
                
            case "in_process":
                System.out.println("[WEBHOOK MP] Mapeo: in_process -> En_proceso");
                return EstadoOrden.En_proceso;
                
            case "authorized":
                System.out.println("[WEBHOOK MP] Mapeo: authorized -> En_proceso");
                return EstadoOrden.En_proceso;
                
            case "rejected":
                if ("cc_rejected_bad_filled_date".equals(mpStatusDetail) || 
                    "cc_rejected_bad_filled_other".equals(mpStatusDetail) ||
                    "cc_rejected_bad_filled_security_code".equals(mpStatusDetail) ||
                    "cc_rejected_blacklist".equals(mpStatusDetail) ||
                    "cc_rejected_call_for_authorize".equals(mpStatusDetail) ||
                    "cc_rejected_card_disabled".equals(mpStatusDetail) ||
                    "cc_rejected_duplicated_payment".equals(mpStatusDetail) ||
                    "cc_rejected_high_risk".equals(mpStatusDetail) ||
                    "cc_rejected_insufficient_amount".equals(mpStatusDetail) ||
                    "cc_rejected_invalid_installments".equals(mpStatusDetail) ||
                    "cc_rejected_max_attempts".equals(mpStatusDetail) ||
                    "cc_rejected_other_reason".equals(mpStatusDetail)) {
                    System.out.println("[WEBHOOK MP] Mapeo: rejected (cc_rejected_*) -> En_proceso (pago rechazado)");
                    return EstadoOrden.En_proceso;
                } else {
                    System.out.println("[WEBHOOK MP] Mapeo: rejected -> En_proceso");
                    return EstadoOrden.En_proceso;
                }
                
            case "cancelled":
                System.out.println("[WEBHOOK MP] Mapeo: cancelled -> En_proceso (pago cancelado)");
                return EstadoOrden.En_proceso;
                
            case "refunded":
                System.out.println("[WEBHOOK MP] Mapeo: refunded -> En_proceso (pago reembolsado)");
                return EstadoOrden.En_proceso;
                
            case "charged_back":
                System.out.println("[WEBHOOK MP] Mapeo: charged_back -> En_proceso (contracargo)");
                return EstadoOrden.En_proceso;
                
            default:
                System.out.println("[WEBHOOK MP] Estado no reconocido: " + mpStatus + " -> En_proceso (default)");
                return EstadoOrden.En_proceso;
        }
    }
    
    // Endpoint de prueba para verificar integración con Mercado Pago
    @GetMapping("/test/{paymentId}")
    public ResponseEntity<String> testPaymentStatus(@PathVariable String paymentId) {
        System.out.println("=== [TEST MP] === Probando pago: " + paymentId + " ===");
        
        try {
            MercadoPagoConfig.setAccessToken(MP_ACCESS_TOKEN);
            PaymentClient paymentClient = new PaymentClient();
            Payment payment = paymentClient.get(Long.parseLong(paymentId));
            
            System.out.println("[TEST MP] Pago obtenido:");
            System.out.println("[TEST MP] - ID: " + payment.getId());
            System.out.println("[TEST MP] - Status: " + payment.getStatus());
            System.out.println("[TEST MP] - Status Detail: " + payment.getStatusDetail());
            System.out.println("[TEST MP] - Order ID: " + (payment.getOrder() != null ? payment.getOrder().getId() : "null"));
            
            String preferenceId = null;
            if (payment.getOrder() != null) {
                preferenceId = String.valueOf(payment.getOrder().getId());
            } else if (payment.getMetadata() != null && payment.getMetadata().get("preference_id") != null) {
                preferenceId = payment.getMetadata().get("preference_id").toString();
            }
            
            if (preferenceId != null) {
                OrdenDeCompra orden = ordenService.findByPreferenceId(preferenceId);
                if (orden != null) {
                    EstadoOrden nuevoEstado = mapearEstadoMercadoPago(payment.getStatus(), payment.getStatusDetail());
                    return ResponseEntity.ok(String.format(
                        "Pago: %s, Status: %s, PreferenceId: %s, Orden: %d, Estado actual: %s, Estado sugerido: %s",
                        paymentId, payment.getStatus(), preferenceId, orden.getId(), orden.getEstado(), nuevoEstado
                    ));
                } else {
                    return ResponseEntity.ok(String.format(
                        "Pago: %s, Status: %s, PreferenceId: %s, Orden: NO ENCONTRADA",
                        paymentId, payment.getStatus(), preferenceId
                    ));
                }
            } else {
                return ResponseEntity.ok(String.format(
                    "Pago: %s, Status: %s, PreferenceId: NO ENCONTRADO",
                    paymentId, payment.getStatus()
                ));
            }
            
        } catch (Exception e) {
            System.out.println("[TEST MP] ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    
    // Endpoint para simular webhook manualmente
    @PostMapping("/simulate/{paymentId}")
    public ResponseEntity<String> simulateWebhook(@PathVariable String paymentId) {
        System.out.println("=== [SIMULATE WEBHOOK] === Simulando webhook para pago: " + paymentId + " ===");
        
        try {
            // Simular el payload que enviaría Mercado Pago
            String simulatedPayload = String.format(
                "{\"type\":\"payment\",\"data\":{\"id\":\"%s\"}}",
                paymentId
            );
            
            System.out.println("[SIMULATE WEBHOOK] Payload simulado: " + simulatedPayload);
            
            // Procesar como si fuera un webhook real
            return procesarNotificacionPago(paymentId);
            
        } catch (Exception e) {
            System.out.println("[SIMULATE WEBHOOK] ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error simulando webhook: " + e.getMessage());
        }
    }
    
    // Endpoint para listar todas las órdenes con preferenceId
    @GetMapping("/orders")
    public ResponseEntity<String> listOrdersWithPreferenceId() {
        System.out.println("=== [LIST ORDERS] === Listando órdenes con preferenceId ===");
        
        try {
            List<OrdenDeCompra> ordenes = ordenService.findAll();
            StringBuilder response = new StringBuilder();
            response.append("Órdenes con preferenceId:\n");
            
            for (OrdenDeCompra orden : ordenes) {
                if (orden.getPreferenceId() != null && !orden.getPreferenceId().isEmpty()) {
                    response.append(String.format(
                        "- ID: %d, Estado: %s, PreferenceId: %s\n",
                        orden.getId(), orden.getEstado(), orden.getPreferenceId()
                    ));
                }
            }
            
            return ResponseEntity.ok(response.toString());
            
        } catch (Exception e) {
            System.out.println("[LIST ORDERS] ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error listando órdenes: " + e.getMessage());
        }
    }
} 