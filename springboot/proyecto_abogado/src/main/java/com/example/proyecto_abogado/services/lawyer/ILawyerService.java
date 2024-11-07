package com.example.proyecto_abogado.services.lawyer;

import com.example.proyecto_abogado.entities.Lawyer;

import java.util.List;

public interface ILawyerService {
    List<Lawyer> getAll();
    Lawyer save(Lawyer lawyer);
    List<Lawyer> findByNameOrDocument(String search);
    Lawyer findById(Long id);
    Lawyer findByDocument(String document);
    Lawyer findByIdUser(Long id);
}
