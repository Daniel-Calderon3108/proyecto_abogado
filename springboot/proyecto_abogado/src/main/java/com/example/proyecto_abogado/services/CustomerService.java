package com.example.proyecto_abogado.services;

import com.example.proyecto_abogado.entities.Customer;
import com.example.proyecto_abogado.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService implements  ICustomerService {

    @Autowired
    private CustomerRepository repository;


    @Override
    public List<Customer> getAll() { return (List<Customer>) repository.findAll(); }

    @Override
    public Customer save(Customer customer) {
        repository.save(customer);
        return customer;
    }
}
