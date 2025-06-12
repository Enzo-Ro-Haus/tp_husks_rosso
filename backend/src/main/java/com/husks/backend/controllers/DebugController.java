package com.husks.backend.controllers;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/debug")
public class DebugController {

    @PostMapping
    public ResponseEntity<String> test(@RequestBody Map<String, Object> body) {
        System.out.println("✅ Recibido en /private/debug: " + body);
        return ResponseEntity.ok("Todo bien");
    }
}