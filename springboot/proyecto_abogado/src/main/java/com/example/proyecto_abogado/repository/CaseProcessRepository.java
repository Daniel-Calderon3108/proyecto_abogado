package com.example.proyecto_abogado.repository;

import com.example.proyecto_abogado.entities.CaseProcess;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CaseProcessRepository extends CrudRepository<CaseProcess, Long> {
    List<CaseProcess> findByidCaseOrNameCaseContainingIgnoreCase(Long id, String search);
}
