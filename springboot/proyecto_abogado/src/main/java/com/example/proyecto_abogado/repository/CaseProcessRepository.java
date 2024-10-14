package com.example.proyecto_abogado.repository;

import com.example.proyecto_abogado.entities.CaseProcess;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CaseProcessRepository extends CrudRepository<CaseProcess, Long> {

}
