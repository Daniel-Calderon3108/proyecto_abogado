package com.example.proyecto_abogado.DTO;

import com.example.proyecto_abogado.entities.Document;
import lombok.*;


@Getter
@Setter
@ToString
public class DocumentRequest {

    private Long idDocument;
    private String urlDocument;
    private String nameDocument;
    private String typeDocument;
    private String statusDocument;
    private String userRegisterDocument;
    private String dateDocument;
    private String userUpdateDocument;
    private String dateUpdateDocument;
    private Long idCase; // id del caso relacionado

    public DocumentRequest() {
    }

    public DocumentRequest(Document document) {
        this.idDocument = document.getId_document();
        this.urlDocument = document.getUrlDocument();
        this.nameDocument = document.getNameDocument();
        this.typeDocument = document.getTypeDocument();
        this.statusDocument = document.getStatusDocument();
        this.userRegisterDocument = document.getUserRegisterDocument();
        this.dateDocument = document.getDateDocument();
        this.userUpdateDocument = document.getUserUpdateDocument();
        this.dateUpdateDocument = document.getDateUpdateDocument();
        this.idCase = document.getCaseProcess().getId_case();
    }
}
