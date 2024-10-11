package com.example.proyecto_abogado.repository;

import com.example.proyecto_abogado.entities.Lawyer;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LawyerRepository extends CrudRepository<Lawyer, Long> {
}
