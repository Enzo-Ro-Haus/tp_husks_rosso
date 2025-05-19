package com.husks.backend.controllers;

import com.husks.backend.dtos.*;
import com.husks.backend.enums.SistemaTalle;
import com.husks.backend.services.*;
import lombok.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/talles")
@RequiredArgsConstructor
public class TalleController {

    private final TalleService talleService;

    @GetMapping("/sistema/{sistema}")
    public ResponseEntity<List<TalleResponseDTO>> listarPorSistema(@PathVariable SistemaTalle sistema) {
        return ResponseEntity.ok(talleService.listarTallesPorSistema(sistema));
    }
}