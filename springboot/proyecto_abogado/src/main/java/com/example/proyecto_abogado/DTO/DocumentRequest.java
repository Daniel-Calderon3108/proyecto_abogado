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
    private String statusDocument;
    private String userRegisterDocument;
    private String dateDocument;
    private String userUpdateDocument;
    private String dateUpdateDocument;
    private nameCase nameIdCase;
    private long sizeDocument;

    // Constructor que recibe un objeto Document
    public DocumentRequest(Document document) {
    }
}