package com.husks.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Importar JsonIgnoreProperties
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Direccion")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
public class Direccion extends Base{

    @Column(nullable = false, length = 100)
    private String calle;

    @Column(nullable = false, length = 50)
    private String localidad;

    @Column(nullable = false, length = 10)
    private String cp;

    @OneToMany(mappedBy = "direccion")
    @JsonIgnoreProperties("direccion")
    private List<UsuarioDireccion> usuarios = new ArrayList<>();
}