package com.example.proyecto_abogado.DTO;

import lombok.Getter;

@Getter
public class Response {
    private final boolean success;
    private final String message;
    private final Object data;
    private final String singleData;

    public Response(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.data = null;
        this.singleData = null;
    }

    public Response(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.singleData = null;
    }

    public Response(boolean success, String message, String singleData) {
        this.success = success;
        this.message = message;
        this.data = null;
        this.singleData = singleData;
    }

    public Response(boolean success, String message, String singleData, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.singleData = singleData;
    }

}
