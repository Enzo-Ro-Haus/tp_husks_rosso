package com.husks.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Importar JsonIgnoreProperties
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Detalle")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
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

    // Explicit getters
    public OrdenDeCompra getOrdenDeCompra() {
        return ordenDeCompra;
    }

    public Producto getProducto() {
        return producto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    // Explicit setters
    public void setOrdenDeCompra(OrdenDeCompra ordenDeCompra) {
        this.ordenDeCompra = ordenDeCompra;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}