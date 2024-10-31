package com.example.proyecto_abogado.controllers;

import com.example.proyecto_abogado.DTO.DocumentRequest;
import com.example.proyecto_abogado.DTO.Response;
import com.example.proyecto_abogado.entities.Document;
import com.example.proyecto_abogado.repository.CaseProcessRepository;
import com.example.proyecto_abogado.services.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private CaseProcessRepository caseProcessRepository;

    @PostMapping("/upload")
    public ResponseEntity<Response> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("id_case") Long idCase,
            @RequestParam("userRegister") String userRegister,
            @RequestParam("status") String status,
            @RequestParam("userUpdate") String userUpdate) {
        try {
            documentService.store(file, idCase,userRegister, status, userUpdate);
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
}