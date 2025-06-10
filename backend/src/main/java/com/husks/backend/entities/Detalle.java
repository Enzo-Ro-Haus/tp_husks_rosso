package com.husks.backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Detalle")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter @Setter
public class Detalle extends Base{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_orden_compra", nullable = false)
    @JsonBackReference
    private OrdenDeCompra ordenDeCompra;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    @JsonBackReference
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;
}