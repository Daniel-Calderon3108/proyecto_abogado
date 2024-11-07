package com.example.proyecto_abogado.controllers;

import com.example.proyecto_abogado.DTO.CaseProcessRequest;
import com.example.proyecto_abogado.DTO.Response;
import com.example.proyecto_abogado.entities.CaseLawyer;
import com.example.proyecto_abogado.entities.CaseProcess;
import com.example.proyecto_abogado.entities.Customer;
import com.example.proyecto_abogado.repository.CaseLawyerRepository;
import com.example.proyecto_abogado.repository.CaseProcessRepository;
import com.example.proyecto_abogado.repository.CustomerRepository;
import com.example.proyecto_abogado.services.caseProcess.ICaseProcessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RequestMapping("api/case")
@RestController
public class CaseProcessController {

    @Autowired
    private ICaseProcessService service;

    @Autowired
    private CaseProcessRepository caseProcessRepository;

    @Autowired
    private CustomerRepository repositoryCustomer;

    @Autowired
    private CaseLawyerRepository caseLawyerRepository;

    // EndPoint Listar Casos
    @GetMapping("")
    public List<CaseProcessRequest> getAll() {
        List<CaseProcess> caseProcesses = service.getAll();
        // Crear JSON personalizado
        return caseProcesses.stream().map(CaseProcessRequest::new).collect(Collectors.toList());
    }

    // EndPoint De Registro Caso
    @PostMapping("register")
    public ResponseEntity<?> save(@RequestBody CaseProcessRequest caseProcess) {
        System.out.println("Caso recibido:" + caseProcess);
        try {
            CaseProcess caseProcessSave = service.save(caseProcess);
            return ResponseEntity.ok(new Response(true, "Caso registrado exitosamente.",
                    Collections.singletonList(caseProcessSave.getIdCase())));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(new Response(false, "Error al registrar el caso "
                    + e.getMessage()));
        }
    }

    // EndPoint Buscar Por Nombre
    @GetMapping("search/{search}")
    public List<CaseProcessRequest> getByName(@PathVariable String search) {
        List<CaseProcess> caseProcesses = service.findByName(search);
        // Crear JSON personalizado
        return caseProcesses.stream().map(CaseProcessRequest::new).collect(Collectors.toList());
    }

    // EndPoint Buscar Por ID
    @GetMapping("searchById/{id}")
    public CaseProcessRequest findById(@PathVariable Long id) {
        CaseProcess caseProcess = service.findById(id);
        // Crear JSON personalizado
        return new CaseProcessRequest(caseProcess);
    }

    @PutMapping("update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody CaseProcessRequest caseProcessRequest) {
        try {
            Optional<CaseProcess> caseProcessData = caseProcessRepository.findById(id);

            if (caseProcessData.isPresent()) {
                CaseProcess updateCaseProcess = caseProcessData.get();
                updateCaseProcess.setNameCase(caseProcessRequest.getNameCase());
                updateCaseProcess.setDescriptionCase(caseProcessRequest.getDescriptionCase());
                updateCaseProcess.setDateInitCase(caseProcessRequest.getDateInitCase());
                updateCaseProcess.setDateEndCase(caseProcessRequest.getDateEndCase());
                updateCaseProcess.setStatusCase(caseProcessRequest.getStatusCase());
                updateCaseProcess.setUpdateUserCase(caseProcessRequest.getUpdateUserCase());
                updateCaseProcess.setUpdateDateCase(caseProcessRequest.getUpdateDateCase());
                updateCaseProcess.setTypeCase(caseProcessRequest.getTypeCase());

                Customer customer = repositoryCustomer.findById(caseProcessRequest.getCustomer().getIdClient())
                        .orElseThrow(() -> new RuntimeException("Cliente no  encontrado"));

                updateCaseProcess.setCustomer(customer);
                caseProcessRepository.save(updateCaseProcess);

                return ResponseEntity.ok(new Response(true, "Caso actualizado exitosamente.",
                        Collections.singletonList(updateCaseProcess.getIdCase())));

            }
            return ResponseEntity.status(401).body(new Response(false, "Cliente no encontrado"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new Response(false, "Error al actualizar el caso "
                    + e.getMessage()));
        }
    }

    @GetMapping("searchByCustomer/{id}/{search}")
    public List<CaseProcessRequest> getCasesByCustomerAndSearch(@PathVariable Long id, @PathVariable String search) {

        List<CaseProcess> caseProcessList = caseProcessRepository.
                    findByCustomer_IdClientAndNameCaseContainingIgnoreCase(id, search);
        return caseProcessList.stream().map(CaseProcessRequest::new).collect(Collectors.toList());
    }

    @GetMapping("searchByLawyer/{id}/{search}")
    public List<CaseProcessRequest> getCaseByLawyerAndSearch(@PathVariable Long id, @PathVariable String search) {
        // Obtener listado de casos donde el abogado este asignado
        List<CaseLawyer> caseLawyerList = caseLawyerRepository.findByLawyer_IdLawyer(id);
        // Crear una lista de casos vacios
        List<CaseProcess> caseProcessList = new ArrayList<>();

        // Recorrer todos los casos
        for(CaseLawyer caseLawyer : caseLawyerList) {
            Optional<CaseProcess> caseProcess = caseProcessRepository.findById(caseLawyer.getCaseProcess().getIdCase());

            if (caseProcess.isPresent()) {
                // Si el caso contiene en su nombre una cadena de palabras enviadas
                if (caseProcess.get().getNameCase().toLowerCase().contains(search)) {
                    caseProcessList.add(caseProcess.get()); // Se almacena el caso en nuestra lista
                }
            }
        }
        // Se retorna la lista de casos que hayan correspondido por los filtros establecidos
        return caseProcessList.stream().map(CaseProcessRequest::new).collect(Collectors.toList());
    }

    @GetMapping("customer/{id}")
    public List<CaseProcessRequest> getCaseOfCustomer(@PathVariable Long id) {
        List<CaseProcess> caseProcessList = caseProcessRepository.findByCustomer_IdClient(id);

        return caseProcessList.stream().map(CaseProcessRequest::new).collect(Collectors.toList());
    }

    @GetMapping("lawyer/{id}")
    public List<CaseProcessRequest> getCaseOfLawyer(@PathVariable Long id) {
        // Obtener listado de casos donde el abogado este asignado
        List<CaseLawyer> caseLawyerList = caseLawyerRepository.findByLawyer_IdLawyer(id);
        // Crear una lista de casos vacios
        List<CaseProcess> caseProcessList = new ArrayList<>();

        for(CaseLawyer caseLawyer : caseLawyerList) {
            Optional<CaseProcess> caseProcess = caseProcessRepository.findById(caseLawyer.getCaseProcess().getIdCase());

            if (caseProcess.isPresent()) {
                caseProcessList.add(caseProcess.get());
            }
        }

        return caseProcessList.stream().map(CaseProcessRequest::new).collect(Collectors.toList());
    }
}
