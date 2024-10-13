package com.example.proyecto_abogado.entities;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "client")
@Getter
@Setter
@ToString
@EqualsAndHashCode

public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_client;
    private String name_client;
    private String address_client;
    private String phone_client;
    private String email_client;
    private String type_client;
    private String user_register_client;
    private String date_register_client;
    private String update_user_client;
    private String date_update_client;
    private String type_document_client;
    private String document_client;
    private boolean status_client;

    // Manera correcta de hacer una relacion 1 a 1
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_user_client", referencedColumnName = "id_user")
    private User user;
}
