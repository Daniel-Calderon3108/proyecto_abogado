package com.example.proyecto_abogado.repository;

import com.example.proyecto_abogado.entities.CaseLawyer;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CaseLawyerRepository extends CrudRepository<CaseLawyer, Long> {
}
