package com.husks.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Importar JsonIgnoreProperties
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Categoria")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
public class Categoria extends Base {

    @Column(nullable = false, length = 50)
    private String nombre;

    @ManyToOne()
    @JoinColumn(name = "id_tipo", nullable = false)
    @JsonIgnoreProperties("categorias")
    private Tipo tipo;

    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnoreProperties("categoria")
    private List<Producto> productos = new ArrayList<>();
}