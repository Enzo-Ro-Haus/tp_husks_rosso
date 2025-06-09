package com.husks.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "Producto")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Producto extends Base {

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
@   JsonBackReference
    private Categoria categoria;

    @ManyToMany
    @JoinTable(name = "Talle_Producto", joinColumns = @JoinColumn(name = "id_producto"), inverseJoinColumns = @JoinColumn(name = "id_talle"))
    @JsonIgnore
    private Set<Talle> tallesDisponibles = new HashSet<>();
}
