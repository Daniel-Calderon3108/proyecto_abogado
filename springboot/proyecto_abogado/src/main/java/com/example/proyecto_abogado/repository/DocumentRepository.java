package com.example.proyecto_abogado.repository;

import com.example.proyecto_abogado.entities.Document;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends CrudRepository<Document, Long> {
}
