package com.husks.backend.auth;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LoginRequest {
    String email;
    String password;
}
