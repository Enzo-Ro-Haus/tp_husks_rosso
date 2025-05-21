package com.husks.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "Direccion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Direccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String calle;

    @Column(nullable = false, length = 50)
    private String localidad;

    @Column(nullable = false, length = 10)
    private String cp;

    @OneToMany(mappedBy = "direccion")
    private List<UsuarioDireccion> usuarios = new ArrayList<>();
}