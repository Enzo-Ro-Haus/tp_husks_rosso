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
        try {
            MercadoPagoConfig.setAccessToken("APP_USR-3234138127327288-072322-8e925fd50b06a15c71e38704a7290d59-2575816659");

            PreferenceBackUrlsRequest backUrls =
                    PreferenceBackUrlsRequest.builder()
                            .success("http://localhost:5173/Cart")
                            .pending("http://localhost:5173/Cart")
                            .failure("http://localhost:5173/Cart")
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
                    .items(items)
                    .backUrls(backUrls)
                    .build();

            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            return preference.getSandboxInitPoint();
        } catch (MPApiException e) {
            System.out.println("❌ Mercado Pago API error: " + e.getApiResponse().getContent());
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}
