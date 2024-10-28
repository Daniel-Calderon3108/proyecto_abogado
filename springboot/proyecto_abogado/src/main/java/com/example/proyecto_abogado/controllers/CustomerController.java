package com.example.proyecto_abogado.controllers;

import com.example.proyecto_abogado.DTO.Response;
import com.example.proyecto_abogado.entities.Customer;
import com.example.proyecto_abogado.repository.CustomerRepository;
import com.example.proyecto_abogado.services.EncriptPassword;
import com.example.proyecto_abogado.services.ICustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequestMapping("api/customer") // Personalizar URL
@RestController
public class CustomerController {

    @Autowired
    private ICustomerService service;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EncriptPassword encriptPassword;

    // EndPoint Listar Clientes
    @GetMapping("")
    public List<Customer> getAll() { return service.getAll(); }

    // EndPoint De Registro Clientes
    @PostMapping("register")
    public ResponseEntity<?> save(@RequestBody Customer customer) {
        System.out.println("Cliente recibido: " + customer); // Imprime el objeto completo
        try {
            Customer customerRegister = service.save(customer);
            return ResponseEntity.ok(new Response(true, "Cliente registrado exitosamente.", customerRegister.getId_client().toString()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new Response(false, "Error al registrar el cliente: "
                    + e.getMessage()));
        }
    }

    // EndPoint Buscar Por Nombre O Documento
    @GetMapping("search/{search}")
    public List<Customer> findByName(@PathVariable String search) { return service.findByNameOrDocument(search); }

    // EndPoint Buscar Por ID
    @GetMapping("searchById/{id}")
    public Customer findById(@PathVariable Long id) { return service.findById(id); }

    @GetMapping("searchDocument/{document}")
    public Customer getByDocument(@PathVariable String document) { return service.findByDocument(document); }

    // EndPoint Actualizar Cliente
    @PutMapping("update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Customer customer) {
        Optional<Customer> customerData = customerRepository.findById(id);

        if (customerData.isPresent()) {
            Customer updateCustomer = customerData.get();
            String password = customer.getUser().getPasswordUser() == null ? updateCustomer.getUser().getPasswordUser()
                    : encriptPassword.encryptExistingPasswords(customer.getUser().getPasswordUser());
            updateCustomer.setNameClient(customer.getNameClient());
            updateCustomer.setAddressClient(customer.getAddressClient());
            updateCustomer.setPhoneClient(customer.getPhoneClient());
            updateCustomer.setEmailClient(customer.getEmailClient());
            updateCustomer.setTypeClient(customer.getTypeClient());
            updateCustomer.setUpdateUserClient(customer.getUpdateUserClient());
            updateCustomer.setDateUpdateClient(customer.getDateUpdateClient());
            updateCustomer.setTypeDocumentClient(customer.getTypeDocumentClient());
            updateCustomer.setDocumentClient(customer.getDocumentClient());
            updateCustomer.setStatusClient(customer.isStatusClient());
            updateCustomer.getUser().setNameUser(customer.getUser().getNameUser());
            updateCustomer.getUser().setPasswordUser(password);
            updateCustomer.getUser().setUserUpdate(customer.getUser().getUserUpdate());
            updateCustomer.getUser().setLastUpdate(customer.getUser().getLastUpdate());
            updateCustomer.getUser().setPhotoUser(customer.getUser().getPhotoUser());
            updateCustomer.getUser().setStatusUser(customer.getUser().isStatusUser());
            customerRepository.save(updateCustomer);
            return ResponseEntity.ok().body(new Response(true, "Se actualizo el cliente", updateCustomer.getId_client().toString()));
        }
        return ResponseEntity.status(401).body(new Response(false, "Cliente no encontrado"));
    }

    // EndPoint Actualizar Status Cliente
    @PutMapping("changeStatus/{id}")
    public ResponseEntity<?> changeStatus(@PathVariable Long id, @RequestBody Customer customer) {
        Optional<Customer> customerData = customerRepository.findById(id);

        if(customerData.isPresent()) {
            Customer updateCustomer = customerData.get();
            updateCustomer.getUser().setStatusUser(!updateCustomer.isStatusClient());
            updateCustomer.setStatusClient(!updateCustomer.isStatusClient());
            updateCustomer.setUpdateUserClient(customer.getUpdateUserClient());
            updateCustomer.setDateUpdateClient(customer.getDateUpdateClient());
            updateCustomer.getUser().setUserUpdate(customer.getUser().getUserUpdate());
            updateCustomer.getUser().setLastUpdate(customer.getUser().getLastUpdate());
            customerRepository.save(updateCustomer);
            return ResponseEntity.ok().body(new Response(true, "Se cambio el status a " + updateCustomer.isStatusClient()));
        }
        return ResponseEntity.status(401).body(new Response(false, "Cliente no encontrado"));
    }
}
