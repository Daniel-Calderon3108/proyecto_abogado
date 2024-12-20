package com.example.proyecto_abogado.repository;

import com.example.proyecto_abogado.entities.Document;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends CrudRepository<Document, Long> {
    List<Document> findByIdDocumentOrNameDocumentContainingIgnoreCase(Long id, String search);
    List<Document> findByCaseProcess_idCase(Long id);
}
