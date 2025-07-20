package com.husks.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.husks.backend.enums.EstadoOrden;
import com.husks.backend.enums.MetodoPago; // Importar MetodoPago
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Orden_Compra")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class OrdenDeCompra extends Base{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario", nullable = false)
    @JsonIgnoreProperties({"ordenes", "direcciones", "password", "rol"})
    private Usuario usuario;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_direccion", nullable = false)
    @JsonIgnoreProperties("ordenes")
    private UsuarioDireccion usuarioDireccion;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal precioTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MetodoPago metodoPago;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoOrden estado = EstadoOrden.En_proceso;

    @OneToMany(mappedBy = "ordenDeCompra", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("ordenDeCompra")
    private List<Detalle> detalles = new ArrayList<>();

    // Explicit getters
    public Usuario getUsuario() {
        return usuario;
    }

    public UsuarioDireccion getUsuarioDireccion() {
        return usuarioDireccion;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public BigDecimal getPrecioTotal() {
        return precioTotal;
    }

    public MetodoPago getMetodoPago() {
        return metodoPago;
    }

    public EstadoOrden getEstado() {
        return estado;
    }

    public List<Detalle> getDetalles() {
        return detalles;
    }

    // Explicit setters
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public void setUsuarioDireccion(UsuarioDireccion usuarioDireccion) {
        this.usuarioDireccion = usuarioDireccion;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public void setPrecioTotal(BigDecimal precioTotal) {
        this.precioTotal = precioTotal;
    }

    public void setMetodoPago(MetodoPago metodoPago) {
        this.metodoPago = metodoPago;
    }

    public void setEstado(EstadoOrden estado) {
        this.estado = estado;
    }

    public void setDetalles(List<Detalle> detalles) {
        this.detalles = detalles;
    }
}