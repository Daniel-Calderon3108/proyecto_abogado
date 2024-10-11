package com.example.proyecto_abogado.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "abogado")
@Getter
@Setter
@ToString
@EqualsAndHashCode

public class Lawyer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long abogado_id;
    private String nombre;
    private String telefono;
    private String correo;
    private String especialidad;
    private String usuario_registra;
    private String fecha_registra;
    private String usuario_actualiza;
    private String fecha_actualiza;
    private String usuario_id;
}
