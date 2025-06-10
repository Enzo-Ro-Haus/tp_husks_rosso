package com.husks.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "Direccion")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Direccion extends Base{

    @Column(nullable = false, length = 100)
    private String calle;

    @Column(nullable = false, length = 50)
    private String localidad;

    @Column(nullable = false, length = 10)
    private String cp;

    @OneToMany(mappedBy = "direccion")
    @JsonBackReference
    private List<UsuarioDireccion> usuarios = new ArrayList<>();
}