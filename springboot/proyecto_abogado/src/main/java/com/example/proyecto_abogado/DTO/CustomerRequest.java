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
    private String documentClient;

    public CustomerRequest() {

    }

    public CustomerRequest(Customer customer) {
        this.idClient = customer.getIdClient();
        this.nameClient = customer.getNameClient();
        this.documentClient = customer.getDocumentClient();
    }
}
