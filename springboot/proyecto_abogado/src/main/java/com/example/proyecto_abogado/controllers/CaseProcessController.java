package com.example.proyecto_abogado.controllers;

import com.example.proyecto_abogado.DTO.CaseProcessRequest;
import com.example.proyecto_abogado.DTO.Response;
import com.example.proyecto_abogado.entities.CaseProcess;
import com.example.proyecto_abogado.repository.CustomerRepository;
import com.example.proyecto_abogado.services.ICaseProcessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("api/case")
@RestController
public class CaseProcessController {

    @Autowired
    private ICaseProcessService service;

    @Autowired
    private CustomerRepository repositoryCustomer;

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
}
