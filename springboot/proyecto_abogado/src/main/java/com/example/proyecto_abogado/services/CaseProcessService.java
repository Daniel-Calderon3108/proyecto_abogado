package com.example.proyecto_abogado.services;

import com.example.proyecto_abogado.DTO.CaseProcessRequest;
import com.example.proyecto_abogado.entities.CaseProcess;
import com.example.proyecto_abogado.entities.Customer;
import com.example.proyecto_abogado.repository.CaseProcessRepository;
import com.example.proyecto_abogado.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CaseProcessService implements ICaseProcessService{

    @Autowired
    CaseProcessRepository caseProcessRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Override
    public List<CaseProcess> getAll() { return (List<CaseProcess>) caseProcessRepository.findAll(); }

    @Override
    public CaseProcess save(CaseProcessRequest caseProcess) {

        CaseProcess newCaseProcess = new CaseProcess();

        newCaseProcess.setNameCase(caseProcess.getNameCase());
        newCaseProcess.setDescriptionCase(caseProcess.getDescriptionCase());
        newCaseProcess.setDateInitCase(caseProcess.getDateInitCase());
        newCaseProcess.setDateEndCase(caseProcess.getDateEndCase());
        newCaseProcess.setStatusCase(caseProcess.getStatusCase());
        newCaseProcess.setUserRegisterCase(caseProcess.getUserRegisterCase());
        newCaseProcess.setDateRegisterCase(caseProcess.getDateRegisterCase());
        newCaseProcess.setUpdateUserCase(caseProcess.getUpdateUserCase());
        newCaseProcess.setUpdateDateCase(caseProcess.getUpdateDateCase());
        newCaseProcess.setTypeCase(caseProcess.getTypeCase());

        Customer customer = customerRepository.findById(caseProcess.getCustomer().getIdClient())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        newCaseProcess.setCustomer(customer);

        return caseProcessRepository.save(newCaseProcess);
    }

    @Override
    public List<CaseProcess> findByName(String search) {
        return caseProcessRepository.findByidCaseOrNameCaseContainingIgnoreCase(convertStringToLongOrDefault(search),search);
    }

    @Override
    public CaseProcess findById(Long id) {
        return caseProcessRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Caso No Encontrado"));
    }

    // Convertir String a Long
    public static Long convertStringToLongOrDefault(String str) {
        try {
            return Long.parseLong(str);
        } catch (NumberFormatException e) {
            return 0L;
        }
    }
}
