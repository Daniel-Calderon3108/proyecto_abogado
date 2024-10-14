package com.example.proyecto_abogado.DTO;

import lombok.Getter;

import java.util.List;

@Getter
public class Response {
    private final boolean success;
    private final String message;
    private final List<?> data;

    public Response(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.data = null;
    }

    public Response(boolean success, String message, List<?> data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}
