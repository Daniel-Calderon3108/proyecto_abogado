package com.example.proyecto_abogado.DTO;

import com.example.proyecto_abogado.entities.Document;
import lombok.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DocumentRequest {

    private Long idDocument;
    private String urlDocument;
    private String nameDocument;
    private String typeDocument;
    private String userRegisterDocument;
    private String dateDocument;
    private String userUpdateDocument;
    private String dateUpdateDocument;
    private nameCase nameIdCase;
    private long sizeDocument;

    // Constructor que recibe un objeto Document
    public DocumentRequest(Document document) {
        this.idDocument = document.getIdDocument();
        this.urlDocument = document.getUrlDocument();
        this.nameDocument = document.getNameDocument();
        this.typeDocument = document.getTypeDocument();
        this.userRegisterDocument = document.getUserRegisterDocument();
        this.dateDocument = document.getDateDocument();
        this.userUpdateDocument = document.getUserUpdateDocument();
        this.dateUpdateDocument = document.getDateUpdateDocument();
        this.nameIdCase = new nameCase(document.getCaseProcess());
        this.sizeDocument = document.getData().length;
    }
}