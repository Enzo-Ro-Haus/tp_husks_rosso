package com.husks.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Importar JsonIgnoreProperties
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Detalle")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter @Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Detalle extends Base{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_orden_compra", nullable = false)
    @JsonIgnoreProperties("detalles")
    private OrdenDeCompra ordenDeCompra;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    @JsonIgnoreProperties("detalles")
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;
}