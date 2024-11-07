package com.example.proyecto_abogado.repository;

import com.example.proyecto_abogado.entities.Customer;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends CrudRepository<Customer, Long> {
    List<Customer> findByNameClientContainingIgnoreCaseOrDocumentClientContaining(String name, String document);
    Customer findByDocumentClient(String document);
    Customer findByUser_IdUser(Long id);
}
