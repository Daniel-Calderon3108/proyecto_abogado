package com.example.proyecto_abogado.controllers;

import com.example.proyecto_abogado.DTO.DocumentRequest;
import com.example.proyecto_abogado.DTO.Response;
import com.example.proyecto_abogado.entities.Document;
import com.example.proyecto_abogado.repository.CaseProcessRepository;
import com.example.proyecto_abogado.services.document.DocumentService;
import com.example.proyecto_abogado.services.document.IDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private IDocumentService service;

    @Autowired
    private CaseProcessRepository caseProcessRepository;

    @PostMapping("/register")
    public ResponseEntity<Response> uploadFile(@RequestParam("file") MultipartFile file,
                                               @RequestParam("idCase") Long idCase,
                                               @ModelAttribute DocumentRequest documentRequest) {
        try {
            documentService.store(file, documentRequest, idCase);
            return ResponseEntity.status(HttpStatus.OK).body(new Response(true, "Archivo subido exitosamente"));
        } catch (Exception e) {
            e.printStackTrace(); // Imprime el error en la consola para más detalles
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Response(false, "Error al subir el archivo"));
        }
    }


    @GetMapping("/files/{id}")
    public ResponseEntity<byte[]> getFile(@PathVariable Long id) throws FileNotFoundException {
        Document fileEntity = documentService.getFile(id).get();
        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.CONTENT_TYPE, fileEntity.getTypeDocument())
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileEntity.getNameDocument()+"\"")
                .body(fileEntity.getData());
    }

    @GetMapping("/files")
    public ResponseEntity<List<DocumentRequest>> getListFiles() {
        List<DocumentRequest> files = documentService.getAllFiles();
        return ResponseEntity.status(HttpStatus.OK).body(files);
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<String> viewFile(@PathVariable Long id) {
        Optional<Document> document = documentService.getFile(id);
        if (document.isPresent()) {
            System.out.println("URL de visualización: " + document.get().getUrlDocument());
            return ResponseEntity.ok(document.get().getUrlDocument());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
    }

    // EndPoint Buscar Por ID
    @GetMapping("searchById/{id}")
    public DocumentRequest findById(@PathVariable Long id) {
        Document document = service.findById(id);
        // Crear JSON personalizado
        return new DocumentRequest(document);
    }

    // EndPoint Buscar Por Nombre
    @GetMapping("search/{search}")
    public List<DocumentRequest> getByName(@PathVariable String search) {
        List<Document> document = service.findByName(search);
        // Crear JSON personalizado
        return document.stream().map(DocumentRequest::new).collect(Collectors.toList());
    }
}