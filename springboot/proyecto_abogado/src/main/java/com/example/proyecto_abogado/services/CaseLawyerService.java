package com.example.proyecto_abogado.services;

import com.example.proyecto_abogado.DTO.CaseLawyerRequest;
import com.example.proyecto_abogado.entities.CaseLawyer;
import com.example.proyecto_abogado.entities.CaseProcess;
import com.example.proyecto_abogado.entities.Lawyer;
import com.example.proyecto_abogado.repository.CaseLawyerRepository;
import com.example.proyecto_abogado.repository.CaseProcessRepository;
import com.example.proyecto_abogado.repository.LawyerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CaseLawyerService implements ICaseLawyerService {

    @Autowired
    private CaseLawyerRepository caseLawyerRepository;

    @Autowired
    private CaseProcessRepository caseProcessRepository;

    @Autowired
    private LawyerRepository lawyerRepository;

    @Override
    public List<CaseLawyer> getAll() { return (List<CaseLawyer>) caseLawyerRepository.findAll(); }

    @Override
    public CaseLawyer save(CaseLawyerRequest caseLawyer) {

        CaseLawyer newCaseLawyer = new CaseLawyer();

        newCaseLawyer.setUserRegisterLawyer(caseLawyer.getUserRegisterLawyer());
        newCaseLawyer.setDateRegisterLawyer(caseLawyer.getDateRegisterLawyer());
        newCaseLawyer.setStatusLawyerCase(caseLawyer.getStatusLawyerCase());

        CaseProcess caseProcess = caseProcessRepository.findById(caseLawyer.getIdCase())
                .orElseThrow(() -> new RuntimeException("Caso no encontrado"));

        newCaseLawyer.setCaseProcess(caseProcess);

        Lawyer lawyer = lawyerRepository.findById(caseLawyer.getIdLawyer())
                .orElseThrow(() -> new RuntimeException("Abogado no encontrado"));

        newCaseLawyer.setLawyer(lawyer);

        return caseLawyerRepository.save(newCaseLawyer);
    }

    @Override
    public List<CaseLawyer> getCaseLawyersByCaseProcessId(Long idCaseProcess) {
        return caseLawyerRepository.findByCaseProcess_IdCase(idCaseProcess);
    }
}
