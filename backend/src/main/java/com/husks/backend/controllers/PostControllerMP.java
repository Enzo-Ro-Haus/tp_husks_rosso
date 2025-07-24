package com.husks.backend.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api")
public class PostControllerMP {

    private static final Logger logger = LoggerFactory.getLogger(PostControllerMP.class);

    public static class ProductoMP {
        public String id;
        public String title;
        public String description;
        public String pictureUrl;
        public String categoryId;
        public Integer quantity;
        public String currencyId;
        public BigDecimal unitPrice;

        // Constructor vacío necesario para Jackson
        public ProductoMP() {}
    }

    @PostMapping("/mercado")
    public String mercado(@RequestBody List<ProductoMP> productos) throws MPException, MPApiException {
        logger.info("🔍 POST /api/mercado llamado");
        logger.info("🔍 Productos recibidos: {}", productos);
        logger.info("🔍 Cantidad de productos: {}", productos != null ? productos.size() : "null");
        MercadoPagoConfig.setAccessToken("TEST-1378664629593967-072216-f3fa0609db060ba8209a26712af99e21-625659215");

        PreferenceBackUrlsRequest backUrls =
                PreferenceBackUrlsRequest.builder()
                        .success("https://localhost:5173/Cart")
                        .pending("https://localhost:5173/Cart")
                        .failure("https://localhost:5173/Cart")
                        .build();

        List<PreferenceItemRequest> items = new ArrayList<>();
        for (ProductoMP p : productos) {
            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .id(p.id)
                    .title(p.title)
                    .description(p.description)
                    .pictureUrl(p.pictureUrl)
                    .categoryId(p.categoryId)
                    .quantity(p.quantity)
                    .currencyId(p.currencyId)
                    .unitPrice(p.unitPrice)
                    .build();
            items.add(itemRequest);
        }

        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(items).backUrls(backUrls).build();

        logger.info("🔍 PreferenceRequest a enviar: {}", preferenceRequest);

        PreferenceClient client = new PreferenceClient();
        Preference preference = client.create(preferenceRequest);

        return preference.getSandboxInitPoint();
    }
}
