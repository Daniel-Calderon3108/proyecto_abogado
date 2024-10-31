package com.example.proyecto_abogado.controllers;

import com.example.proyecto_abogado.DTO.CaseLawyerRequest;
import com.example.proyecto_abogado.DTO.Response;
import com.example.proyecto_abogado.entities.CaseLawyer;
import com.example.proyecto_abogado.repository.CaseLawyerRepository;
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

    @Autowired
    private CaseLawyerRepository caseLawyerRepository;

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

    // EndPoint Buscar Por Id Caso
    @GetMapping("search/case/{id}")
    public List<CaseLawyerRequest> getCaseLawyersByCaseProcessId(@PathVariable Long id) {
        List<CaseLawyer> caseLawyers = service.getCaseLawyersByCaseProcessId(id);
        // Crear JSON personalizado
        return caseLawyers.stream().map(CaseLawyerRequest::new).collect(Collectors.toList());
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<?> deleteCaseLawyerByIdCase(@PathVariable Long id) {
        try{
            List<CaseLawyer> caseLawyers = service.getCaseLawyersByCaseProcessId(id);
            if(caseLawyers.size() > 0) {
                caseLawyerRepository.deleteAll(caseLawyers);
                return ResponseEntity.ok(new Response(true, "Se eliminaron los abogados del caso con exito"));
            } else {
                return ResponseEntity.ok(new Response(false, "Caso no encontrado o no se el caso no tenia asignado abogados"));
            }
        }catch (Exception e) {
            return ResponseEntity.status(500).body(new Response(false, "Error al eliminar los abogados asignados al caso "
                    + e.getMessage()));
        }
    }
}
