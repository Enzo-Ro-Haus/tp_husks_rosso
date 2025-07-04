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

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "categoria_tipo",
        joinColumns = @JoinColumn(name = "categoria_id"),
        inverseJoinColumns = @JoinColumn(name = "tipo_id")
    )
    @JsonIgnoreProperties({"categorias", "productos"})
    private List<Tipo> tipos = new ArrayList<>();

    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnoreProperties({"categoria", "tipo", "tallesDisponibles"})
    private List<Producto> productos = new ArrayList<>();
}