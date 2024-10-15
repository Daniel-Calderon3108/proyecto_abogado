package com.example.proyecto_abogado.repository;

import com.example.proyecto_abogado.entities.CaseLawyer;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CaseLawyerRepository extends CrudRepository<CaseLawyer, Long> {
    List<CaseLawyer> findByCaseProcess_IdCase(Long idCaseProcess);
}
