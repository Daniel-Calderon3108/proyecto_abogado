package com.example.proyecto_abogado.services;

import com.example.proyecto_abogado.DTO.DocumentRequest;
import com.example.proyecto_abogado.entities.CaseProcess;
import com.example.proyecto_abogado.entities.Document;
import com.example.proyecto_abogado.repository.CaseProcessRepository;
import com.example.proyecto_abogado.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DocumentService implements IDocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private CaseProcessRepository caseProcessRepository;

    @Override
    public List<Document> getAllDocuments() {
        return (List<Document>) documentRepository.findAll();
    }

    @Override
    public Optional<Document> getDocumentById(Long id) {
        return documentRepository.findById(id);
    }

    @Override
    public Document saveDocument(DocumentRequest documentRequest) {
        Document document = new Document();

        document.setUrlDocument(documentRequest.getUrlDocument());
        document.setNameDocument(documentRequest.getNameDocument());
        document.setTypeDocument(documentRequest.getTypeDocument());
        document.setStatusDocument(documentRequest.getStatusDocument());
        document.setUserRegisterDocument(documentRequest.getUserRegisterDocument());
        document.setDateDocument(documentRequest.getDateDocument());
        document.setUserUpdateDocument(documentRequest.getUserUpdateDocument());
        document.setDateUpdateDocument(documentRequest.getDateUpdateDocument());

        // Relación con CaseProcess
        CaseProcess caseProcess = caseProcessRepository.findById(documentRequest.getNameIdCase().getIdCase())
                .orElseThrow(() -> new RuntimeException("Caso no encontrado"));
        document.setCaseProcess(caseProcess);

        return documentRepository.save(document);
    }
}
