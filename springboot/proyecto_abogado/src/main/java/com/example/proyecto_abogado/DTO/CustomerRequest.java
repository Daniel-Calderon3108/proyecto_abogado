package com.example.proyecto_abogado.DTO;

import com.example.proyecto_abogado.entities.Customer;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CustomerRequest {
    private Long idClient;
    private String nameClient;

    public CustomerRequest() {

    }

    public CustomerRequest(Customer customer) {
        this.idClient = customer.getId_client();
        this.nameClient = customer.getNameClient();
    }
}
