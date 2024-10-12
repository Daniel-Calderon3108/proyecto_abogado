package com.example.proyecto_abogado.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@ToString
@EqualsAndHashCode

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long usuario_id;
    private String nombre;
    private String clave;
    private String usuario_registra;
    private String fecha_registra;
    private String usuario_actualiza;
    private String fecha_actualiza;
    private String avatar;
    private String estado;
}
