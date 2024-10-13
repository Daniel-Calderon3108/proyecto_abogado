package com.example.proyecto_abogado.services;

import com.example.proyecto_abogado.entities.Customer;
import com.example.proyecto_abogado.entities.Lawyer;
import com.example.proyecto_abogado.repository.CustomerRepository;
import com.example.proyecto_abogado.repository.LawyerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LawyerService implements ILawyerService{

    @Autowired
    private LawyerRepository repository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public List<Lawyer> getAll() { return (List<Lawyer>) repository.findAll(); }

    @Override
    public void save(Lawyer lawyer) {
        // Verificar si la contraseña ya está cifrada
        if (!lawyer.getUser().getPassword_user().startsWith("$2a$")) { // BCrypt hashes start with $2a$
            // Cifrar la contraseña antes de guardarla
            String contrasenaCifrada = passwordEncoder.encode(lawyer.getUser().getPassword_user());
            lawyer.getUser().setPassword_user(contrasenaCifrada);
        }
        repository.save(lawyer);
    }

    public void encryptExistingPasswords() {
        List<Lawyer> customerList = (List<Lawyer>) repository.findAll();
        for (Lawyer lawyer : customerList) {
            if (!lawyer.getUser().getPassword_user().startsWith("$2a$")) {
                String encryptedPassword = passwordEncoder.encode(lawyer.getUser().getPassword_user());
                lawyer.getUser().setPassword_user(encryptedPassword);
                repository.save(lawyer);
            }
        }
    }
}
