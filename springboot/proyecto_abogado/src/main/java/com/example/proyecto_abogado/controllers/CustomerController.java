package com.example.proyecto_abogado.controllers;

import com.example.proyecto_abogado.entities.Customer;
import com.example.proyecto_abogado.entities.User;
import com.example.proyecto_abogado.services.ICustomerService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/customer")
@RestController
public class CustomerController {

    @Autowired
    private ICustomerService service;

    @GetMapping("Customers")
    public List<Customer> getAll() { return service.getAll(); }

    //enpoint de registro
    @PostMapping("register")
    public ResponseEntity<?> save(@RequestBody Customer customer) {
        System.out.println("Customer recibido: " + customer); // Imprime el objeto completo
        try {
            service.save(customer);
            return ResponseEntity.ok(new UserController.LoginResponse(true, "Usuario registrado exitosamente."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new UserController.LoginResponse(false, "Error al registrar el usuario: " + e.getMessage()));
        }

    }

    // Clase para la respuesta de login
    @Getter
    public static class registro {
        private final boolean success;
        private final String message;

        public registro(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
    }
}
