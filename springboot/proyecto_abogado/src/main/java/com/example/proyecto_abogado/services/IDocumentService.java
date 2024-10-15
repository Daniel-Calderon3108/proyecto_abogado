package com.example.proyecto_abogado.services;

import com.example.proyecto_abogado.DTO.DocumentRequest;
import com.example.proyecto_abogado.entities.Document;

import java.util.List;
import java.util.Optional;

public interface IDocumentService {

    List<Document> getAllDocuments(); // Listar todos los documentos

    Optional<Document> getDocumentById(Long id); // Obtener documento por ID

    Document saveDocument(DocumentRequest documentRequest); // Guardar un documento
}
