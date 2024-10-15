package com.example.proyecto_abogado.services;

import com.example.proyecto_abogado.entities.Customer;

import java.util.List;

public interface ICustomerService {
    List<Customer> getAll();
    void save(Customer customer);
    List<Customer> findByName(String name);
    Customer findById(Long id);
}
