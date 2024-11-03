package com.example.proyecto_abogado.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Table(name = "notify")
@Getter
@Setter
@EqualsAndHashCode
@Entity
public class Notify {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_notify")
    private Long idNotify;
    @Column(name = "description_notify")
    private String descriptionNotify;
    @Column(name = "url_notify")
    private String urlNotify;
    @Column(name = "type_notify")
    private String typeNotify;
    @Column(name = "is_notify")
    private boolean isNotify;
    @Column(name = "date_register")
    private String dateRegister;
    @Column(name = "user_register")
    private String userRegister;

    @ManyToOne
    @JoinColumn(name = "id_user")
    @JsonBackReference ("notify_user")
    private User user;
}
