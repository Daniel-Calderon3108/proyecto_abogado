package com.example.proyecto_abogado.services;

import com.example.proyecto_abogado.entities.Lawyer;
import com.example.proyecto_abogado.repository.LawyerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LawyerService implements ILawyerService{

    @Autowired
    private LawyerRepository repository;

    @Autowired
    private EncriptPassword encriptPassword;

    @Override
    public List<Lawyer> getAll() { return (List<Lawyer>) repository.findAll(); }

    @Override
    public void save(Lawyer lawyer) {
        lawyer.getUser().setPasswordUser(encriptPassword.encryptExistingPasswords(lawyer.getUser().getPasswordUser()));
        repository.save(lawyer);
    }

    @Override
    public List<Lawyer> findByName(String name) { return repository.findByNameLawyerContainingIgnoreCase(name); }

    @Override
    public Lawyer findById(Long id) {
        return repository.findById(id)
                .orElseThrow(()-> new RuntimeException("Abogado No Encontrado"));
    }
}
