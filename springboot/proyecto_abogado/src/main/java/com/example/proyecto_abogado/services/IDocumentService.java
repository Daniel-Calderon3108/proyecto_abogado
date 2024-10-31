package com.example.proyecto_abogado.services;

import com.example.proyecto_abogado.DTO.DocumentRequest;
import com.example.proyecto_abogado.entities.Document;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IDocumentService {
    // Permite almacenar o cargar archivos a la base de datos
    Document store(MultipartFile file, Long idCase, String userRegister, String statusDocument, String userUpdate) throws IOException;

    // Permite descargar archivos de nuestra base de datos
    Optional<Document> getFile (Long id) throws FileNotFoundException;

    // Permite consultar la lista de archivos cargados a nuestra base de datos
    List<DocumentRequest> getAllFiles();
}