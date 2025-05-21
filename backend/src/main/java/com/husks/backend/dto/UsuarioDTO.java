package com.husks.backend.dto;

import com.husks.backend.enums.Rol;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
public class UsuarioDTO {
    Long id;
    String name;
    String email;
    Rol rol;
}
