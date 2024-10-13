package com.example.proyecto_abogado.services;

import com.example.proyecto_abogado.entities.Customer;
import com.example.proyecto_abogado.entities.User;
import com.example.proyecto_abogado.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService implements  ICustomerService {

    @Autowired
    private CustomerRepository repository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;


    @Override
    public List<Customer> getAll() { return (List<Customer>) repository.findAll(); }

    @Override
    public void save(Customer customer) {
        // Verificar si la contraseña ya está cifrada
        if (!customer.getUser().getPassword_user().startsWith("$2a$")) { // BCrypt hashes start with $2a$
            // Cifrar la contraseña antes de guardarla
            String contrasenaCifrada = passwordEncoder.encode(customer.getUser().getPassword_user());
            customer.getUser().setPassword_user(contrasenaCifrada);
        }
        repository.save(customer);
    }

    public void encryptExistingPasswords() {
        List<Customer> customerList = (List<Customer>) repository.findAll();
        for (Customer customer : customerList) {
            if (!customer.getUser().getPassword_user().startsWith("$2a$")) {
                String encryptedPassword = passwordEncoder.encode(customer.getUser().getPassword_user());
                customer.getUser().setPassword_user(encryptedPassword);
                repository.save(customer);
            }
        }
    }
}
