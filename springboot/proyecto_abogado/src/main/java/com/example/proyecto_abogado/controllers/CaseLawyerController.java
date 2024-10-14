package com.example.proyecto_abogado.controllers;

import com.example.proyecto_abogado.DTO.CaseLawyerRequest;
import com.example.proyecto_abogado.DTO.Response;
import com.example.proyecto_abogado.entities.CaseLawyer;
import com.example.proyecto_abogado.services.ICaseLawyerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("api/caseLawyer")
@RestController
public class CaseLawyerController {

    @Autowired
    private ICaseLawyerService service;

    // End Point Listar Casos Asignados Abogado
    @GetMapping("")
    public List<CaseLawyerRequest> getAll() {
        List<CaseLawyer> caseLawyers = service.getAll();
        // Crear JSON personalizado
        return caseLawyers.stream().map(CaseLawyerRequest::new).collect(Collectors.toList());
    }

    // EndPoint De Asignacion de Abogado
    @PostMapping("register")
    public ResponseEntity<?> save(@RequestBody CaseLawyerRequest caseLawyer) {
        System.out.println("Abogado a asignar al caso: " + caseLawyer);
        try {
            service.save(caseLawyer);
            return ResponseEntity.ok(new Response(true, "Se asigno el abogado al caso exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new Response(false, "Error al asignar el abogado al caso "
                    + e.getMessage()));
        }
    }
}
