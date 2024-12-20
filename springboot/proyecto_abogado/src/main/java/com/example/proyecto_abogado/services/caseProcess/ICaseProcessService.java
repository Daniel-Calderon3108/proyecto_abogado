package com.example.proyecto_abogado.services.caseProcess;

import com.example.proyecto_abogado.DTO.CaseProcessRequest;
import com.example.proyecto_abogado.entities.CaseProcess;

import java.util.List;

public interface ICaseProcessService {
    List<CaseProcess> getAll();
    CaseProcess save(CaseProcessRequest caseProcess);
    List<CaseProcess> findByName(String search);
    CaseProcess findById(Long id);
}
