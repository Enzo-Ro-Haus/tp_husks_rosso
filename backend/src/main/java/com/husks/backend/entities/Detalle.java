package com.husks.backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Detalle")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter @Setter
public class Detalle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_orden_compra", nullable = false)
    private OrdenCompra ordenCompra;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;
}