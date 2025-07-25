package com.husks.backend.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.husks.backend.entities.OrdenDeCompra;
import com.husks.backend.enums.EstadoOrden;
import com.husks.backend.services.OrdenDeCompraServiceImpl;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mercadopago/webhook")
public class MercadoPagoWebhookController {

    @Autowired
    private OrdenDeCompraServiceImpl ordenService;

    @PostMapping
    public ResponseEntity<String> recibirNotificacion(@RequestBody String payload) {
        System.out.println("[WEBHOOK MP] Notificación recibida: " + payload);
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(payload);
            String type = root.path("type").asText();
            String paymentId = null;
            String preferenceId = null;
            String status = null;

            if (type.equals("payment")) {
                paymentId = root.path("data").path("id").asText();
                if (paymentId != null && !paymentId.isEmpty()) {
                    // Configura el access token de Mercado Pago
                    MercadoPagoConfig.setAccessToken("APP_USR-3234138127327288-072322-8e925fd50b06a15c71e38704a7290d59-2575816659");
                    PaymentClient paymentClient = new PaymentClient();
                    try {
                        Payment payment = paymentClient.get(Long.parseLong(paymentId));
                        preferenceId = payment.getOrder() != null ? String.valueOf(payment.getOrder().getId()) : payment.getMetadata().get("preference_id").toString();
                        status = payment.getStatus();
                        System.out.println("[WEBHOOK MP] paymentId=" + paymentId + ", preferenceId=" + preferenceId + ", status=" + status);
                    } catch (MPApiException | MPException e) {
                        e.printStackTrace();
                        return ResponseEntity.status(500).body("Error consultando pago en Mercado Pago");
                    }
                }
            }

            // Si tienes el preferenceId, busca la orden y actualiza el estado
            if (preferenceId != null && !preferenceId.isEmpty()) {
                OrdenDeCompra orden = ordenService.findByPreferenceId(preferenceId);
                if (orden != null) {
                    // Mapear el status de Mercado Pago a EstadoOrden
                    if ("approved".equalsIgnoreCase(status)) {
                        orden.setEstado(EstadoOrden.Entregado);
                    } else if ("pending".equalsIgnoreCase(status)) {
                        orden.setEstado(EstadoOrden.En_proceso);
                    } else {
                        orden.setEstado(EstadoOrden.En_proceso); // Puedes agregar más estados si lo deseas
                    }
                    ordenService.save(orden);
                    System.out.println("[WEBHOOK MP] Orden actualizada: " + orden.getId() + " nuevo estado: " + orden.getEstado());
                } else {
                    System.out.println("[WEBHOOK MP] No se encontró orden con preferenceId: " + preferenceId);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error procesando webhook");
        }
        return ResponseEntity.ok("Recibido");
    }
} 