package com.husks.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;


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
    @JsonBackReference
    private List<Categoria> categorias = new ArrayList<>();
}