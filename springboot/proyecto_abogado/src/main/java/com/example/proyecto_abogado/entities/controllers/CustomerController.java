package com.example.proyecto_abogado.entities.controllers;

import com.example.proyecto_abogado.entities.Customer;
import com.example.proyecto_abogado.services.ICustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CustomerController {

    @Autowired
    private ICustomerService service;

    @GetMapping("Customers")
    public List<Customer> getAll() { return service.getAll(); }

    @PostMapping("newCustomer")
    public Long save(@RequestBody Customer customer) {
        Customer customerSave = service.save(customer);
        return customerSave.getCliente_id();
    }
}
