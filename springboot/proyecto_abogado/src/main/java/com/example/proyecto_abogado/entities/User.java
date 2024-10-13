package com.example.proyecto_abogado.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "user")
@Getter
@Setter
@ToString
@EqualsAndHashCode

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_user;
    @Column(name = "name_user") // Alias para el campo name_user en la BD
    private String name;

    private String password_user;
    private String user_register;
    private String date_register;
    private String user_update;
    private String last_update;
    private String photo_user;
    private boolean status_user;
}
