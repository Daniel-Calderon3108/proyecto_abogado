package com.example.proyecto_abogado.services.document;

import com.example.proyecto_abogado.DTO.DocumentRequest;
import com.example.proyecto_abogado.entities.Document;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface IDocumentService {
    // Permite almacenar o cargar archivos a la base de datos
    Document store(MultipartFile file, DocumentRequest documentRequest, Long idCase) throws IOException;

    // Permite consultar la lista de archivos cargados a nuestra base de datos
    List<DocumentRequest> getAllFiles();

    //metodo añadido para Google Drive
    String uploadFile(MultipartFile file) throws IOException;

    Document findById(Long id);

    List<Document> findByName(String search);
}