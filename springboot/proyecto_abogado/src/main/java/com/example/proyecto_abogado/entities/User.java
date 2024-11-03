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
    @Column (name = "id_user")
    private Long idUser;
    @Column(name = "name_user") // Agregar Alias
    private String nameUser;
    @Column(name = "password_user")
    private String passwordUser;
    @Column(name = "user_register")
    private String userRegister;
    @Column(name = "date_register")
    private String dateRegister;
    @Column(name = "user_update")
    private String userUpdate;
    @Column(name = "last_update")
    private String lastUpdate;
    @Column(name = "photo_user")
    private String photoUser;
    @Column(name = "status_user")
    private boolean statusUser;
    @Column(name = "rol_user")
    private String rolUser;
}
