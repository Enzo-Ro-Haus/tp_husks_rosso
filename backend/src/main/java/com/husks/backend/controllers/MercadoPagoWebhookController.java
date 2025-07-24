package com.husks.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mercadopago/webhook")
public class MercadoPagoWebhookController {

    @PostMapping
    public ResponseEntity<String> recibirNotificacion(@RequestBody String payload) {
        System.out.println("[WEBHOOK MP] Notificación recibida: " + payload);
        // No se realiza ninguna acción, solo se responde OK
        return ResponseEntity.ok("Recibido");
    }
} 