package com.example.proyecto_abogado.controllers;

import com.example.proyecto_abogado.DTO.Response;
import com.example.proyecto_abogado.entities.Customer;
import com.example.proyecto_abogado.services.ICustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/customer") // Personalizar URL
@RestController
public class CustomerController {

    @Autowired
    private ICustomerService service;

    // EndPoint Listar Clientes
    @GetMapping("")
    public List<Customer> getAll() { return service.getAll(); }

    // EndPoint De Registro Clientes
    @PostMapping("register")
    public ResponseEntity<?> save(@RequestBody Customer customer) {
        System.out.println("Cliente recibido: " + customer); // Imprime el objeto completo
        try {
            service.save(customer);
            return ResponseEntity.ok(new Response(true, "Cliente registrado exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new Response(false, "Error al registrar el cliente: "
                    + e.getMessage()));
        }
    }

    // EndPoint Buscar Por Nombre
    @GetMapping("search/{name}")
    public List<Customer> findByName(@PathVariable String name) { return service.findByName(name); }

    // EndPoint Buscar Por ID
    @GetMapping("searchById/{id}")
    public Customer findById(@PathVariable Long id) { return service.findById(id);  }
}
