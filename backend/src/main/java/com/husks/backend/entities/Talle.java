package com.husks.backend.entities;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.husks.backend.enums.SistemaTalle;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Talle", uniqueConstraints = @UniqueConstraint(
        columnNames = {"sistema_talle", "valor_talle"}))
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Talle extends Base{

    @Enumerated(EnumType.STRING)
    @Column(name = "sistema_talle", nullable = false)
    private SistemaTalle sistema = SistemaTalle.americano;

    @Column(name = "valor_talle", nullable = false, length = 10)
    private String valor;

    @ManyToMany(mappedBy = "tallesDisponibles")
    @JsonBackReference
    private Set<Producto> productos = new HashSet<>();
}
