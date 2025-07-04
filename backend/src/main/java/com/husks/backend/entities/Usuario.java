package com.husks.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Importar JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.husks.backend.enums.Rol;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "Usuario")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "authorities", "accountNonExpired", "accountNonLocked", "credentialsNonExpired", "enabled"})
public class Usuario extends Base implements UserDetails {

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "password", nullable = false, length = 64)
    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol = Rol.CLIENTE;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("usuario")
    private List<UsuarioDireccion> direcciones = new ArrayList<>();

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("usuario")
    private List<OrdenDeCompra> ordenes = new ArrayList<>();

    @Column(name = "imagen_perfil_public_id")
    private String imagenPerfilPublicId;

    // Explicit getters
    public String getNombre() {
        return nombre;
    }

    public String getEmail() {
        return email;
    }

    public Rol getRol() {
        return rol;
    }

    public List<UsuarioDireccion> getDirecciones() {
        return direcciones;
    }

    public List<OrdenDeCompra> getOrdenes() {
        return ordenes;
    }

    public String getImagenPerfilPublicId() {
        return imagenPerfilPublicId;
    }

    // Explicit setters
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public void setDirecciones(List<UsuarioDireccion> direcciones) {
        this.direcciones = direcciones;
    }

    public void setOrdenes(List<OrdenDeCompra> ordenes) {
        this.ordenes = ordenes;
    }

    public void setImagenPerfilPublicId(String imagenPerfilPublicId) {
        this.imagenPerfilPublicId = imagenPerfilPublicId;
    }

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(("ROLE_" + rol.name())));
    }

    @Override
    @JsonIgnore
    public String getPassword() {
        return this.password;
    }

    @Override
    @JsonIgnore
    public String getUsername() {
        return this.email;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return true;
    }
}