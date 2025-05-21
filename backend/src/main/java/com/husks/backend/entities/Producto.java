package com.husks.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Producto")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter @Setter
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal precio;

    @Column(nullable = false)
    private Integer cantidad;

    @Lob
    private String descripcion;

    private String color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @ManyToMany
    @JoinTable(name = "Talle_Producto",
            joinColumns = @JoinColumn(name = "id_producto"),
            inverseJoinColumns = @JoinColumn(name = "id_talle"))
    private Set<Talle> tallesDisponibles = new HashSet<>();
}
