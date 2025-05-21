package com.husks.backend.entities;


import com.husks.backend.enums.SistemaTalle;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Talle", uniqueConstraints = @UniqueConstraint(
        columnNames = {"sistema_talle", "valor_talle"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Talle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_talle")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "sistema_talle", nullable = false)
    private SistemaTalle sistema;

    @Column(name = "valor_talle", nullable = false, length = 10)
    private String valor;

    @ManyToMany(mappedBy = "tallesDisponibles")
    private Set<Producto> productos = new HashSet<>();
}
