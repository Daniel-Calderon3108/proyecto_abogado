package com.example.proyecto_abogado.entities.controllers;

import com.example.proyecto_abogado.entities.Lawyer;
import com.example.proyecto_abogado.services.ILawyerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class LawyerController {

    @Autowired
    private ILawyerService service;

    @GetMapping("Lawyers")
    public List<Lawyer> getAll() { return service.getAll(); }

    @PostMapping("newLawyer")
    public Long save(@RequestBody Lawyer lawyer) {
        Lawyer lawyerSave = service.save(lawyer);
        return lawyerSave.getAbogado_id();
    }
}
