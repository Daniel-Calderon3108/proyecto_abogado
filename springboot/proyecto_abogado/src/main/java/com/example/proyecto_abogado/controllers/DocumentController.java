package com.example.proyecto_abogado.controllers;

import com.example.proyecto_abogado.DTO.DocumentRequest;
import com.example.proyecto_abogado.DTO.Response;
import com.example.proyecto_abogado.entities.Document;
import com.example.proyecto_abogado.services.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @GetMapping("listDocument")
    public List<DocumentRequest> getAllDocuments() {
        List<Document> documents = documentService.getAllDocuments();
        return documents.stream().map(DocumentRequest::new).collect(Collectors.toList());
    }

    @GetMapping("listDocument/{id}")
    public ResponseEntity<DocumentRequest> getDocumentById(@PathVariable Long id) {
        Optional<Document> document = documentService.getDocumentById(id);
        return document.map(value -> new ResponseEntity<>(new DocumentRequest(value), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("register")
    public ResponseEntity<?> saveDocument(@RequestBody DocumentRequest documentRequest) {
        System.out.println("Caso recibido:" + documentRequest);
        try {
            documentService.saveDocument(documentRequest);
            return ResponseEntity.ok(new Response(true, "Documento registrado exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new Response(false, "Error al registrar el documento: " + e.getMessage()));
        }
    }
}
