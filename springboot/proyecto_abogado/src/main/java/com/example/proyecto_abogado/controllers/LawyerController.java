package com.example.proyecto_abogado.controllers;

import com.example.proyecto_abogado.DTO.LawyerRequest;
import com.example.proyecto_abogado.DTO.Response;
import com.example.proyecto_abogado.entities.Lawyer;
import com.example.proyecto_abogado.repository.LawyerRepository;
import com.example.proyecto_abogado.services.Encript.EncriptPassword;
import com.example.proyecto_abogado.services.lawyer.ILawyerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequestMapping("api/lawyer")
@RestController
public class LawyerController {

    @Autowired
    private ILawyerService service;

    @Autowired
    private LawyerRepository lawyerRepository;

    @Autowired
    private  EncriptPassword encriptPassword;

    // EndPoint Listar Abogados
    @GetMapping("")
    public List<Lawyer> getAll() { return service.getAll(); }

    // EndPoint De Registro Abogado
    @PostMapping("register")
    public ResponseEntity<?> save(@RequestBody Lawyer lawyer) {
        System.out.println("Abogado recibido: " + lawyer); // Imprime el objeto completo
        try {
            Lawyer lawyerRegister = service.save(lawyer);
            return ResponseEntity.ok(new Response(true, "Abogado registrado exitosamente.", lawyerRegister.getId_lawyer().toString()));
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
    public LawyerRequest getById(@PathVariable Long id) {

        Lawyer lawyer = service.findById(id);

        return new LawyerRequest(lawyer);
    }

    @GetMapping("searchDocument/{document}")
    public Lawyer getByDocument(@PathVariable String document) { return service.findByDocument(document); }

    // EndPoint Actualizar Abogado
    @PutMapping("update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Lawyer lawyer) {
        Optional<Lawyer> lawyerData = lawyerRepository.findById(id);

        if(lawyerData.isPresent()) {
            Lawyer updateLawyer = lawyerData.get();
            String password = lawyer.getUser().getPasswordUser() == null ? updateLawyer.getUser().getPasswordUser()
                    : encriptPassword.encryptExistingPasswords(lawyer.getUser().getPasswordUser());
            updateLawyer.setNameLawyer(lawyer.getNameLawyer());
            updateLawyer.setPhoneLawyer(lawyer.getPhoneLawyer());
            updateLawyer.setEmailLawyer(lawyer.getEmailLawyer());
            updateLawyer.setTypeLawyer(lawyer.getTypeLawyer());
            updateLawyer.setUserUpdateLawyer(lawyer.getUserUpdateLawyer());
            updateLawyer.setDateUpdateLawyer(lawyer.getDateUpdateLawyer());
            updateLawyer.setTypeDocumentLawyer(lawyer.getTypeDocumentLawyer());
            updateLawyer.setDocumentLawyer(lawyer.getDocumentLawyer());
            updateLawyer.setStatusLawyer(lawyer.isStatusLawyer());
            updateLawyer.getUser().setNameUser(lawyer.getUser().getNameUser());
            updateLawyer.getUser().setPasswordUser(password);
            updateLawyer.getUser().setUserUpdate(lawyer.getUser().getUserUpdate());
            updateLawyer.getUser().setLastUpdate(lawyer.getUser().getLastUpdate());
            updateLawyer.getUser().setPhotoUser(lawyer.getUser().getPhotoUser());
            updateLawyer.getUser().setStatusUser(lawyer.getUser().isStatusUser());
            lawyerRepository.save(updateLawyer);
            return ResponseEntity.ok().body(new Response(true, "Se actualizo el abogado", updateLawyer.getId_lawyer().toString()));
        }
        return ResponseEntity.status(401).body(new Response(false, "Abogado no encontrado"));
    }

    // EndPoint Actualizar Status Abogado
    @PutMapping("changeStatus/{id}")
    public ResponseEntity<?> ChangeStatus(@PathVariable Long id, @RequestBody Lawyer lawyer) {
        Optional<Lawyer> lawyerData = lawyerRepository.findById(id);

        if (lawyerData.isPresent()) {
            Lawyer updateLawyer = lawyerData.get();
            updateLawyer.getUser().setStatusUser(!updateLawyer.isStatusLawyer());
            updateLawyer.setStatusLawyer(!updateLawyer.isStatusLawyer());
            updateLawyer.setUserUpdateLawyer(lawyer.getUserUpdateLawyer());
            updateLawyer.setDateUpdateLawyer(lawyer.getDateUpdateLawyer());
            updateLawyer.getUser().setUserUpdate(lawyer.getUser().getUserUpdate());
            updateLawyer.getUser().setLastUpdate(lawyer.getUser().getLastUpdate());
            lawyerRepository.save(updateLawyer);
            return ResponseEntity.ok().body(new Response(true, "Se cambio el status a " + updateLawyer.isStatusLawyer()));
        }
        return ResponseEntity.status(401).body(new Response(false, "Abogado no encontrado"));
    }
}
