package com.example.proyecto_abogado.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "client")
@Getter
@Setter
@ToString
@EqualsAndHashCode

public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_client")
    private Long idClient;
    @Column(name = "name_client")
    private String nameClient;
    @Column(name = "address_client")
    private String addressClient;
    @Column(name = "phone_client")
    private String phoneClient;
    @Column(name = "email_client")
    private String emailClient;
    @Column(name = "type_client")
    private String typeClient;
    @Column(name = "user_register_client")
    private String userRegisterClient;
    @Column(name = "date_register_client")
    private String dateRegisterClient;
    @Column(name = "update_user_client")
    private String updateUserClient;
    @Column(name = "date_update_client")
    private String dateUpdateClient;
    @Column(name = "type_document_client")
    private String typeDocumentClient;
    @Column(name = "document_client")
    private String documentClient;
    @Column(name = "status_client")
    private boolean statusClient;

    // Manera correcta de hacer una relacion 1 a 1
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_user_client", referencedColumnName = "id_user")
    private User user;

    // Realizar relación uno a muchos
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference ("case-customer") // Evitar crear bucle, lado principal
    private List<CaseProcess> caseProcess = new ArrayList<>();
}
