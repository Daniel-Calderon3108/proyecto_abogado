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

    @Autowired
    private EncriptPassword encriptPassword;


    @Override
    public List<Customer> getAll() { return (List<Customer>) repository.findAll(); }

    @Override
    public void save(Customer customer) {
        customer.getUser().setPasswordUser(encriptPassword.encryptExistingPasswords(customer.getUser().getPasswordUser()));
        repository.save(customer);
    }

    @Override
    public List<Customer> findByNameOrDocument(String search) {
        return repository.findByNameClientContainingIgnoreCaseOrDocumentClientContaining(search, search);
    }

    @Override
    public Customer findById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cliente No Encontrado"));
    }

    @Override
    public Customer findByDocument(String document) { return repository.findByDocumentClient(document); }
}
