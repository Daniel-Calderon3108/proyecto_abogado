package com.example.proyecto_abogado.services;

import com.example.proyecto_abogado.DTO.DocumentRequest;
import com.example.proyecto_abogado.DTO.nameCase;
import com.example.proyecto_abogado.entities.CaseProcess;
import com.example.proyecto_abogado.entities.Document;
import com.example.proyecto_abogado.repository.CaseProcessRepository;
import com.example.proyecto_abogado.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class DocumentService implements IDocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private CaseProcessRepository caseProcessRepository;

    @Override
    public Document store(MultipartFile file, Long idCase,String userRegister, String statusDocument, String userUpdate) throws IOException {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo no puede estar vacío");
        }

        // Busca el caso relacionado utilizando el idCase
        CaseProcess caseProcess = caseProcessRepository.findById(idCase)
                .orElseThrow(() -> new RuntimeException("Caso no encontrado"));

        // Asignar valores a la entidad Document
        Document documentEntity = new Document();
        documentEntity.setNameDocument(fileName);
        documentEntity.setTypeDocument(file.getContentType());
        documentEntity.setData(file.getBytes());
        documentEntity.setUserRegisterDocument(userRegister);
        documentEntity.setDateDocument(LocalDateTime.now().toString());
        documentEntity.setDateUpdateDocument(LocalDateTime.now().toString());
        documentEntity.setStatusDocument(statusDocument);
        documentEntity.setCaseProcess(caseProcess);
        documentEntity.setUserUpdateDocument(userUpdate);


        // Asigna la URL del documento, por ejemplo, guardando el nombre del archivo
        String url = "http://localhost:8080/documents/" + file.getOriginalFilename(); // Ajusta la URL según tu necesidad
        documentEntity.setUrlDocument(url);

        return documentRepository.save(documentEntity);
    }

    @Override
    public Optional<Document> getFile(Long id) throws FileNotFoundException {
        Optional<Document> file = documentRepository.findById(id);
        if(file.isPresent()){
            return file;
        }
        throw new FileNotFoundException();
    }

    @Override
    public List<DocumentRequest> getAllFiles() {
        List<DocumentRequest> files = StreamSupport.stream(documentRepository.findAll().spliterator(), false)
                .map(dbFile -> {
                    String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                            .path("api/documents/files/")
                            .path(dbFile.getId_document().toString())
                            .toUriString();
                    return DocumentRequest.builder()
                            .idDocument(dbFile.getId_document())
                            .nameDocument(dbFile.getNameDocument())
                            .urlDocument(fileDownloadUri)
                            .typeDocument(dbFile.getTypeDocument())
                            .dateDocument(dbFile.getDateDocument())
                            .statusDocument(dbFile.getStatusDocument())
                            .userRegisterDocument(dbFile.getUserRegisterDocument())
                            .userUpdateDocument(dbFile.getUserUpdateDocument())
                            .dateUpdateDocument(dbFile.getDateUpdateDocument())
                            .nameIdCase(dbFile.getCaseProcess() != null ? new nameCase(dbFile.getCaseProcess()):null) // Asigna nameCase creado a partir de CaseProcess)
                            .sizeDocument(dbFile.getData().length)
                            .build();
                })
                .collect(Collectors.toList());
        return files;
    }
}