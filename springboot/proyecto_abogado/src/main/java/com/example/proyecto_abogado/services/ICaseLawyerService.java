package com.example.proyecto_abogado.services;

import com.example.proyecto_abogado.DTO.CaseLawyerRequest;
import com.example.proyecto_abogado.entities.CaseLawyer;

import java.util.List;

public interface ICaseLawyerService {
    List<CaseLawyer> getAll();
    CaseLawyer save(CaseLawyerRequest caseLawyerRequest);
    List<CaseLawyer> getCaseLawyersByCaseProcessId(Long idCaseProcess);
}
