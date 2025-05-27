package com.husks.backend.entities;

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
    private OrdenDeCompra ordenDeCompra;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;
}