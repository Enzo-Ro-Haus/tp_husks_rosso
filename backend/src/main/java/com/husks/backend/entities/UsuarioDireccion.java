package com.husks.backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Usuario_Direccion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDireccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_direccion", nullable = false)
    private Direccion direccion;
}