package com.example.proyecto_abogado.controllers;

import com.example.proyecto_abogado.DTO.NotifyRequest;
import com.example.proyecto_abogado.DTO.Response;
import com.example.proyecto_abogado.entities.*;
import com.example.proyecto_abogado.repository.*;
import com.example.proyecto_abogado.services.INotifyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequestMapping("api/notify")
@RestController
public class NotifyController {

    @Autowired
    private INotifyService service;

    @Autowired
    private NotifyRepository notifyRepository;

    @Autowired
    private CaseLawyerRepository caseLawyerRepository;

    @Autowired
    private LawyerRepository lawyerRepository;

    @Autowired
    private CaseProcessRepository caseProcessRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // EndPoint Listar Notificaciones Por Usuario
    @GetMapping("{id}")
    public List<NotifyRequest> getNotifyByIdUser(@PathVariable Long id) {
        List<Notify> notifies = service.getNotifyByIdUser(id);
        return notifies.stream().map(NotifyRequest::new).collect(Collectors.toList());
    }

    // EndPoint Crear Notificación
    // Id Representa Id del Caso
    @PostMapping("register/{id}")
    public ResponseEntity<?> save(@PathVariable Long id, @RequestBody NotifyRequest notifyRequest) {
        System.out.println("Notificación Recibida: " + notifyRequest);
        try {
            System.out.println("ID Recibido" + id);
            // Si el id case fue enviado
            if (!id.equals(0L)) {
                // Obtener los abogados asignados al caso
                List<CaseLawyer> caseLawyerList = caseLawyerRepository.findByCaseProcess_IdCase(id);

                // Se recorren los abogados asignados para crear una notificación para cada uno
                for (CaseLawyer caseLawyer : caseLawyerList) {
                    Optional<Lawyer> lawyer = lawyerRepository.findById(caseLawyer.getLawyer().getId_lawyer());

                    if (lawyer.isPresent()) {
                        notifyRequest.setIdUser(lawyer.get().getUser().getIdUser());
                        service.save(notifyRequest);
                    } else {
                        return ResponseEntity.status(404).body(new Response(false, "No se encontro el abogado"));
                    }
                }
                // Si se esta creando un nuevo caso, notificar al cliente
                if (notifyRequest.getTypeNotify().equals("Nuevo Caso") || notifyRequest.getTypeNotify().equals("Editar Caso")) {
                    Optional<CaseProcess> caseProcess = caseProcessRepository.findById(id);

                    if (caseProcess.isPresent()) {
                        Optional<Customer> customer = customerRepository.findById(caseProcess.get().getCustomer().getId_client());

                        if (customer.isPresent()) {
                            notifyRequest.setIdUser(customer.get().getUser().getIdUser());
                            service.save(notifyRequest);
                        } else {
                            return ResponseEntity.status(404).body(new Response(false, "No se encontro el cliente"));
                        }
                    } else {
                        return ResponseEntity.status(404).body(new Response(false, "No se encontro el caso"));
                    }
                }
            } else {
                Notify notify = service.save(notifyRequest);
            }
             return ResponseEntity.ok(new Response(true, "Se creo la notificación con exito."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new Response(false, "Error al crear notificación "
                    + e.getMessage()));
        }
    }

    // EndPoint Marcar Como Vista Notificación
    @PutMapping("update/view/{id}")
    public ResponseEntity<?> setView(@PathVariable Long id, @RequestBody NotifyRequest notifyRequest) {
        try {
            Optional<Notify> notifyData = notifyRepository.findById(id);

            if(notifyData.isPresent()) {
                Notify updateNotify = notifyData.get();
                updateNotify.setNotify(notifyRequest.isNotify());
                notifyRepository.save(updateNotify);
                return ResponseEntity.ok(new Response(true, "Se marco como vista la notificación con exito."));
            }
            return ResponseEntity.status(404).body(new Response(false, "No se encontro la notificación"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new Response(false, "Error al marcar como vista la notificación "
                    + e.getMessage()));
        }
    }
}
