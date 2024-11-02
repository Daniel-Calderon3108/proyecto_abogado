package com.example.proyecto_abogado.repository;

import com.example.proyecto_abogado.entities.CommentCase;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentCaseRepository extends CrudRepository<CommentCase, Long> {
    List<CommentCase> findByCaseProcess_IdCaseOrderByLastUpdateDesc(Long idCase);
}
