package com.husks.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.husks.backend.enums.EstadoOrden;
import com.husks.backend.enums.MetodoPago; // Importar MetodoPago
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Orden_Compra")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter @Setter
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
    private LocalDate fecha;

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
}