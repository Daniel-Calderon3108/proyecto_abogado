package com.example.proyecto_abogado.services;

import com.example.proyecto_abogado.entities.Customer;

import java.util.List;

public interface ICustomerService {
    List<Customer> getAll();
    Customer save(Customer customer);
}