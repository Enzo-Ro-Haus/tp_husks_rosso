package com.husks.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "Tipo")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tipo extends Base{

    @Column(nullable = false, length = 20)
    private String nombre;

    @OneToMany(mappedBy = "tipo", cascade = CascadeType.ALL)
    private List<Categoria> categorias = new ArrayList<>();
}