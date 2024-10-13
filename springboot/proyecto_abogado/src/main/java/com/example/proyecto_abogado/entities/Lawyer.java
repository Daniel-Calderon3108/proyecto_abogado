package com.example.proyecto_abogado.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "lawyer")
@Getter
@Setter
@ToString
@EqualsAndHashCode

public class Lawyer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_lawyer;
    private String name_lawyer;
    private String phone_lawyer;
    private String email_lawyer;
    private String type_lawyer;
    private String user_register_lawyer;
    private String date_register_lawyer;
    private String user_update_lawyer;
    private String date_update_lawyer;
    private String type_document_lawyer;
    private String document_lawyer;
    private boolean status_lawyer;

    // Manera correcta de hacer una relacion 1 a 1
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id_lawyer", referencedColumnName = "id_user")
    private User user;
}
