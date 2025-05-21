package com.husks.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/husks/v1") //Ruta protegida
@RequiredArgsConstructor
public class backendController {

    @PostMapping(value = "husks")
    public String welcome(){
        return "Welcome from secure point";
    }
}
