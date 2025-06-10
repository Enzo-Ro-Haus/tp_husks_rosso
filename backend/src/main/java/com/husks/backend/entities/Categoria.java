package com.husks.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "Categoria")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categoria extends Base {

    @Column(nullable = false, length = 50)
    private String nombre;


    @ManyToOne()
    @JoinColumn(name = "id_tipo", nullable = false)
    @JsonManagedReference
    private Tipo tipo;

    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonBackReference
    private List<Producto> productos = new ArrayList<>();
}
