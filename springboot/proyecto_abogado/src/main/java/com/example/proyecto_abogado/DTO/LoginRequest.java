package com.example.proyecto_abogado.DTO;


import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    private String name;
    private String password;

    public LoginRequest() {
    }

    // Constructor con parámetros
    public LoginRequest(String name, String password) {
        this.name = name;
        this.password = password;
    }
}