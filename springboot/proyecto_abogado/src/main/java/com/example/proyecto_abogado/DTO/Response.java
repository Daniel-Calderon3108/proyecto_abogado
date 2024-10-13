package com.example.proyecto_abogado.DTO;

import lombok.Getter;

@Getter
public class Response {
    private final boolean success;
    private final String message;

    public Response(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}
