package com.husks.backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Usuario_Direccion")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDireccion extends Base{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonBackReference // No se incluye el usuario para evitar el bucle
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_direccion", nullable = false)
    @JsonBackReference //Lo mismo con la direccion, tal vez debería cambairlo
    private Direccion direccion;
}