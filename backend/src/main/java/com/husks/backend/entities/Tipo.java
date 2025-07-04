package com.husks.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Importar JsonIgnoreProperties
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
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
public class Tipo extends Base{

    @Column(nullable = false, length = 20)
    private String nombre;

    @ManyToMany(mappedBy = "tipos", fetch = FetchType.LAZY)
    @JsonIgnoreProperties("tipos")
    private List<Categoria> categorias = new ArrayList<>();
}