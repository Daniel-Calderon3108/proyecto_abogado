package com.example.proyecto_abogado.controllers;

import com.example.proyecto_abogado.DTO.Response;
import com.example.proyecto_abogado.entities.Lawyer;
import com.example.proyecto_abogado.services.ILawyerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/lawyer")
@RestController
public class LawyerController {

    @Autowired
    private ILawyerService service;

    // EndPoint Listar Abogados
    @GetMapping("")
    public List<Lawyer> getAll() { return service.getAll(); }

    // EndPoint De Registro Abogado
    @PostMapping("register")
    public ResponseEntity<?> save(@RequestBody Lawyer lawyer) {
        System.out.println("Abogado recibido: " + lawyer); // Imprime el objeto completo
        try {
            service.save(lawyer);
            return ResponseEntity.ok(new Response(true, "Abogado registrado exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new Response(false, "Error al registrar el abogado: "
                    + e.getMessage()));
        }
    }

    // EndPoint Buscar Por Nombre O Documento
    @GetMapping("search/{search}")
    public List<Lawyer> getByName(@PathVariable String search) { return service.findByNameOrDocument(search); }

    // EndPoint Buscar Por ID
    @GetMapping("searchById/{id}")
    public Lawyer getById(@PathVariable Long id) { return service.findById(id); }
}
